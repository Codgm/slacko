// middleware.js - DB 기반 Auth + Books + Projects API 처리

module.exports = (req, res, next) => {
  // JSON Server 라우터 인스턴스에 접근하기 위해 next()에서 받아옴
  const router = req.app.db || req.app.locals.db;
  
  // ✅ CORS 설정
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning");
  res.header("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  console.log(`📡 ${req.method} ${req.url}`);

  const getDbData = () => {
    try {
      if (req.app.db && req.app.db.getState) {
        return req.app.db.getState();
      }
      console.warn('⚠️ DB 인스턴스에 접근할 수 없습니다');
      return null;
    } catch (error) {
      console.error('❌ DB 접근 오류:', error);
      return null;
    }
  };

  // =========================
  // 📚 BOOKS ENDPOINTS (새로 추가)
  // =========================

  // ✅ 1. 모든 책 조회 (GET /api/books)
  if ((req.url === "/books" || req.url === "/api/books") && req.method === "GET") {
    console.log("📚 모든 책 조회 요청");
    const db = getDbData();
    if (db && db.books) {
      console.log(`✅ 책 조회 성공: ${db.books.length}개`);
      return res.json(db.books);
    }
    // DB에 books가 없으면 빈 배열 반환
    console.log("⚠️ DB에서 책을 찾을 수 없음, 빈 배열 반환");
    return res.json([]);
  }

  // ✅ 2. 키워드로 책 검색 (GET /api/books/search?keyword=)
  if (req.url.startsWith("/books/search?keyword=") && req.method === "GET") {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const keyword = urlParams.searchParams.get('keyword');
    console.log("📚 키워드 검색 요청:", keyword);
    
    const db = getDbData();
    if (db && db.books && keyword) {
      const results = db.books.filter(book =>
        book.title.toLowerCase().includes(keyword.toLowerCase()) ||
        book.author.toLowerCase().includes(keyword.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      console.log(`✅ 검색 결과: ${results.length}개`);
      return res.json(results);
    }
    
    // 키워드가 없거나 DB에 접근할 수 없으면 빈 배열 반환
    console.log("⚠️ 검색 조건 부족 또는 DB 접근 실패, 빈 배열 반환");
    return res.json([]);
  }

  // ✅ 3. 제목으로 책 검색 (GET /api/books/search/title?title=)
  if (req.url.startsWith("/books/search/title?title=") && req.method === "GET") {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const title = urlParams.searchParams.get('title');
    console.log("📚 제목 검색 요청:", title);
    
    const db = getDbData();
    if (db && db.books && title) {
      const results = db.books.filter(book =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      
      console.log(`✅ 제목 검색 결과: ${results.length}개`);
      return res.json(results);
    }
    return res.json([]);
  }

  // ✅ 4. 저자로 책 검색 (GET /api/books/search/author?author=)
  if (req.url.startsWith("/books/search/author?author=") && req.method === "GET") {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const author = urlParams.searchParams.get('author');
    console.log("📚 저자 검색 요청:", author);
    
    const db = getDbData();
    if (db && db.books && author) {
      const results = db.books.filter(book =>
        book.author.toLowerCase().includes(author.toLowerCase())
      );
      
      console.log(`✅ 저자 검색 결과: ${results.length}개`);
      return res.json(results);
    }
    return res.json([]);
  }

  // ✅ 5. 특정 책 조회 (GET /api/books/:id)
  if (req.url.match(/^\/books\/(\d+)$/) && req.method === "GET") {
    const bookId = parseInt(req.url.match(/^\/books\/(\d+)$/)[1]);
    console.log("📚 특정 책 조회 요청:", bookId);
    
    const db = getDbData();
    if (db && db.books) {
      const book = db.books.find(b => b.id === bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      console.log("✅ 책 조회 성공:", book.title);
      return res.json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  }

  // ✅ 6. 책 등록 (POST /api/books)
  if ((req.url === "/books" || req.url === "/api/books") && req.method === "POST") {
    console.log("📚 책 등록 요청:", req.body);
    
    const db = getDbData();
    if (db) {
      // books 배열이 없으면 생성
      if (!db.books) {
        db.books = [];
      }
      
      const newBook = {
        id: Math.max(...(db.books.length > 0 ? db.books.map(b => b.id) : [0]), 0) + 1,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        studyPeriodActive: this.isStudyPeriodActive(req.body.studyStartDate, req.body.studyEndDate),
        progressPercentage: 0
      };
      
      db.books.push(newBook);
      
      // JSON Server에 변경사항 저장
      try {
        if (req.app.db && req.app.db.write) {
          req.app.db.write();
        }
      } catch (error) {
        console.warn('DB 저장 실패:', error);
      }
      
      console.log("✅ 책 등록 완료:", newBook.title);
      return res.status(201).json(newBook);
    }
    
    return res.status(500).json({ message: "Database access failed" });
  }

  // ✅ 7. 책 수정 (PUT /api/books/:id)
  if (req.url.match(/^\/books\/(\d+)$/) && req.method === "PUT") {
    const bookId = parseInt(req.url.match(/^\/books\/(\d+)$/)[1]);
    console.log("📚 책 수정 요청:", bookId, req.body);
    
    const db = getDbData();
    if (db && db.books) {
      const bookIndex = db.books.findIndex(b => b.id === bookId);
      if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      db.books[bookIndex] = {
        ...db.books[bookIndex],
        ...req.body,
        updatedAt: new Date().toISOString(),
        studyPeriodActive: this.isStudyPeriodActive(
          req.body.studyStartDate || db.books[bookIndex].studyStartDate, 
          req.body.studyEndDate || db.books[bookIndex].studyEndDate
        )
      };
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 책 수정 완료:", db.books[bookIndex].title);
      return res.json(db.books[bookIndex]);
    }
    return res.status(404).json({ message: "Book not found" });
  }

  // ✅ 8. 책 삭제 (DELETE /api/books/:id)
  if (req.url.match(/^\/books\/(\d+)$/) && req.method === "DELETE") {
    const bookId = parseInt(req.url.match(/^\/books\/(\d+)$/)[1]);
    console.log("📚 책 삭제 요청:", bookId);
    
    const db = getDbData();
    if (db && db.books) {
      const bookIndex = db.books.findIndex(b => b.id === bookId);
      if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      const deletedBook = db.books.splice(bookIndex, 1)[0];
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 책 삭제 완료:", deletedBook.title);
      return res.status(204).end();
    }
    return res.status(404).json({ message: "Book not found" });
  }

  // ✅ 9. 현재 학습 중인 책들 조회 (GET /api/books/active)
  if ((req.url === "/books/active" || req.url === "/api/books/active") && req.method === "GET") {
    console.log("📚 활성 책 조회 요청");
    const db = getDbData();
    if (db && db.books) {
      const activeBooks = db.books.filter(book => book.studyPeriodActive === true);
      console.log(`✅ 활성 책 조회 결과: ${activeBooks.length}개`);
      return res.json(activeBooks);
    }
    return res.json([]);
  }

  // ✅ 10. 학습 시작일이 임박한 책들 조회 (GET /api/books/starting-soon?days=)
  if (req.url.startsWith("/books/starting-soon?days=") && req.method === "GET") {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const days = parseInt(urlParams.searchParams.get('days')) || 7;
    console.log("📚 임박한 책 조회 요청:", days);
    
    const db = getDbData();
    if (db && db.books) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      
      const startingSoonBooks = db.books.filter(book => {
        const startDate = new Date(book.studyStartDate);
        return startDate >= today && startDate <= futureDate;
      });
      
      console.log(`✅ 임박한 책 조회 결과: ${startingSoonBooks.length}개`);
      return res.json(startingSoonBooks);
    }
    return res.json([]);
  }

  // 학습 기간 활성화 상태 확인 헬퍼 함수
  function isStudyPeriodActive(startDate, endDate) {
    if (!startDate || !endDate) return false;
    
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return today >= start && today <= end;
  }

  // =========================
  // 🔐 AUTH ENDPOINTS
  // =========================
  
  // ✅ Google OAuth URL 생성
  if ((req.url === "/auth/oauth2/google" || req.url === "/api/auth/oauth2/google") && req.method === "GET") {
    const GOOGLE_CLIENT_ID = "623565422201-43krrk2a7uu4nuqql49pe7na34bbimdr.apps.googleusercontent.com";
    
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: "http://localhost:3001/auth/google/callback",
      response_type: "code",
      scope: "openid profile email",
      access_type: "offline",
      prompt: "select_account"
    });
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    return res.json({
      authUrl: googleAuthUrl,
      message: "Google OAuth URL generated successfully"
    });
  }

  // ✅ Google OAuth 콜백 처리
  if (req.url.startsWith("/auth/google/callback") && req.method === "GET") {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const code = urlParams.searchParams.get('code');
    const error = urlParams.searchParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect(`http://localhost:3000/?error=${encodeURIComponent(error)}`);
    }
    
    if (!code) {
      return res.redirect('http://localhost:3000/?error=no_code');
    }
    
    console.log('✅ Received authorization code:', code);
    const redirectUrl = `http://localhost:3000/auth/callback?success=true&code=${code}`;
    return res.redirect(302, redirectUrl);
  }

  // ✅ 토큰 교환 엔드포인트
  if ((req.url === "/auth/exchange-token" || req.url === "/api/auth/exchange-token") && req.method === "POST") {
    return res.json({
      accessToken: "mock_access_token_12345",
      refreshToken: "mock_refresh_token_67890",
      tokenType: "Bearer",
      expiresIn: 3600,
      userInfo: {
        id: "google_user_123",
        email: "user@gmail.com",
        name: "구글사용자",
        avatar: "https://lh3.googleusercontent.com/a/default-user",
        provider: "google"
      }
    });
  }

  // ✅ 사용자 정보 조회
  if ((req.url === "/auth/me" || req.url === "/api/auth/me") && req.method === "GET") {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json({
      id: "google_user_123",
      email: "user@gmail.com",
      name: "구글사용자",
      avatar: "https://lh3.googleusercontent.com/a/default-user",
      provider: "google",
      university: "과탑대학교",
      major: "컴퓨터공학과",
      year: "3학년",
      createdAt: "2024-01-01T00:00:00.000Z"
    });
  }

  // ✅ 토큰 검증
  if ((req.url === "/auth/validate" || req.url === "/api/auth/validate") && req.method === "POST") {
    const authHeader = req.headers.authorization;
    return res.json({ valid: authHeader?.startsWith("Bearer ") || false });
  }

  // ✅ 토큰 갱신
  if ((req.url === "/auth/refresh" || req.url === "/api/auth/refresh") && req.method === "POST") {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    return res.json({
      accessToken: "mock_new_access_token_67890",
      refreshToken: "mock_new_refresh_token_12345",
      tokenType: "Bearer",
      expiresIn: 3600
    });
  }

  // ✅ 로그아웃
  if ((req.url === "/auth/logout" || req.url === "/api/auth/logout") && req.method === "POST") {
    return res.status(204).end();
  }

  // =========================
  // 🚀 PROJECTS ENDPOINTS (DB 기반)
  // =========================

  // ✅ 1. 모든 프로젝트 조회 (GET /projects 또는 /api/projects)
  if ((req.url === "/projects" || req.url === "/api/projects") && req.method === "GET") {
    console.log("🚀 모든 프로젝트 조회 요청");
    const db = getDbData();
    if (db && db.projects) {
      console.log(`✅ 프로젝트 조회 성공: ${db.projects.length}개`);
      return res.json(db.projects);
    }
    console.log("⚠️ DB에서 프로젝트를 찾을 수 없음, JSON Server로 전달");
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 프로젝트 분석 데이터 (우선순위를 높여서 위로 이동)
  if ((req.url === "/projects/analytics" || req.url === "/api/projects/analytics") && req.method === "GET") {
    console.log("🚀 프로젝트 분석 데이터 요청");
    
    const db = getDbData();
    if (db) {
      const projects = db.projects || [];
      const tasks = db.tasks || [];
      
      const totalProjects = projects.length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
      const notStartedProjects = projects.filter(p => p.status === 'not-started').length;
      const overallProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
      const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
      const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      const analytics = {
        totalProjects,
        completedProjects,
        inProgressProjects,
        notStartedProjects,
        overallProgress: Math.round(overallProgress),
        totalTasks,
        completedTasks,
        taskCompletionRate: Math.round(taskCompletionRate),
        totalBudget,
        totalSpent,
        budgetUtilization: Math.round(budgetUtilization),
        mostActiveUsers: [
          {
            userId: 1,
            name: "김현우",
            tasksCompleted: Math.floor(completedTasks * 0.3),
            hoursWorked: tasks.reduce((acc, task) => acc + (task.actualHours || 0), 0)
          }
        ]
      };
      
      console.log("✅ 분석 데이터 생성 완료:", {
        totalProjects,
        totalTasks,
        overallProgress: analytics.overallProgress
      });
      return res.json(analytics);
    }
    
    // DB 접근 실패시 기본 응답
    console.log("⚠️ DB 접근 실패, 기본 분석 데이터 반환");
    return res.json({
      totalProjects: 0,
      completedProjects: 0,
      inProgressProjects: 0,
      notStartedProjects: 0,
      overallProgress: 0,
      totalTasks: 0,
      completedTasks: 0,
      taskCompletionRate: 0,
      totalBudget: 0,
      totalSpent: 0,
      budgetUtilization: 0,
      mostActiveUsers: []
    });
  }

  // ✅ 2. 특정 프로젝트 조회 (GET /projects/:id)
  if (req.url.match(/^\/(?:api\/)?projects\/(\d+)$/) && req.method === "GET") {
    const projectId = parseInt(req.url.match(/^\/(?:api\/)?projects\/(\d+)$/)[1]);
    console.log("🚀 특정 프로젝트 조회 요청:", projectId);
    
    const db = getDbData();
    if (db && db.projects) {
      const project = db.projects.find(p => p.id === projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      console.log("✅ 프로젝트 조회 성공:", project.name);
      return res.json(project);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 3. 프로젝트 생성 (POST /projects)
  if ((req.url === "/projects" || req.url === "/api/projects") && req.method === "POST") {
    console.log("🚀 프로젝트 생성 요청:", req.body);
    
    const db = getDbData();
    if (db && db.projects) {
      const newProject = {
        id: Math.max(...db.projects.map(p => p.id), 0) + 1,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
        tasks: [],
        milestones: [],
        activities: [],
        files: []
      };
      
      db.projects.push(newProject);
      
      // JSON Server에 변경사항 저장
      try {
        if (req.app.db && req.app.db.write) {
          req.app.db.write();
        }
      } catch (error) {
        console.warn('DB 저장 실패:', error);
      }
      
      console.log("✅ 프로젝트 생성 완료:", newProject.name);
      return res.status(201).json(newProject);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 4. 프로젝트 수정 (PUT /projects/:id)
  if (req.url.match(/^\/projects\/(\d+)$/) && req.method === "PUT") {
    const projectId = parseInt(req.url.match(/^\/projects\/(\d+)$/)[1]);
    console.log("🚀 프로젝트 수정 요청:", projectId, req.body);
    
    const db = getDbData();
    if (db && db.projects) {
      const projectIndex = db.projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      db.projects[projectIndex] = {
        ...db.projects[projectIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 프로젝트 수정 완료:", db.projects[projectIndex].name);
      return res.json(db.projects[projectIndex]);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 5. 프로젝트 삭제 (DELETE /projects/:id)
  if (req.url.match(/^\/projects\/(\d+)$/) && req.method === "DELETE") {
    const projectId = parseInt(req.url.match(/^\/projects\/(\d+)$/)[1]);
    console.log("🚀 프로젝트 삭제 요청:", projectId);
    
    const db = getDbData();
    if (db && db.projects) {
      const projectIndex = db.projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const deletedProject = db.projects.splice(projectIndex, 1)[0];
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 프로젝트 삭제 완료:", deletedProject.name);
      return res.status(204).end();
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 6. 프로젝트 검색 (GET /projects/search?q=)
  if (req.url.startsWith("/projects/search?") && req.method === "GET") {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const query = urlParams.searchParams.get('q');
    console.log("🚀 프로젝트 검색 요청:", query);
    
    const db = getDbData();
    if (db && db.projects) {
      const results = db.projects.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
      
      console.log(`✅ 검색 결과: ${results.length}개`);
      return res.json(results);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 7. 상태별 프로젝트 조회 (GET /projects/status/:status)
  if (req.url.match(/^\/projects\/status\/(.+)$/) && req.method === "GET") {
    const status = req.url.match(/^\/projects\/status\/(.+)$/)[1];
    console.log("🚀 상태별 프로젝트 조회:", status);
    
    const db = getDbData();
    if (db && db.projects) {
      const results = db.projects.filter(project => project.status === status);
      console.log(`✅ 상태별 결과: ${results.length}개`);
      return res.json(results);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 8. 우선순위별 프로젝트 조회 (GET /projects/priority/:priority)
  if (req.url.match(/^\/projects\/priority\/(.+)$/) && req.method === "GET") {
    const priority = req.url.match(/^\/projects\/priority\/(.+)$/)[1];
    console.log("🚀 우선순위별 프로젝트 조회:", priority);
    
    const db = getDbData();
    if (db && db.projects) {
      const results = db.projects.filter(project => project.priority === priority);
      console.log(`✅ 우선순위별 결과: ${results.length}개`);
      return res.json(results);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 9. 프로젝트 분석 데이터 (GET /projects/analytics)
  if ((req.url === "/projects/analytics" || req.url === "/api/projects/analytics") && req.method === "GET") {
    console.log("🚀 프로젝트 분석 데이터 요청");
    
    const db = getDbData();
    if (db && db.projects && db.tasks) {
      const projects = db.projects;
      const tasks = db.tasks;
      
      const totalProjects = projects.length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
      const notStartedProjects = projects.filter(p => p.status === 'not-started').length;
      const overallProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
      const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
      const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      const analytics = {
        totalProjects,
        completedProjects,
        inProgressProjects,
        notStartedProjects,
        overallProgress: Math.round(overallProgress),
        totalTasks,
        completedTasks,
        taskCompletionRate: Math.round(taskCompletionRate),
        totalBudget,
        totalSpent,
        budgetUtilization: Math.round(budgetUtilization),
        mostActiveUsers: [
          {
            userId: 1,
            name: "김현우",
            tasksCompleted: completedTasks,
            hoursWorked: tasks.reduce((acc, task) => acc + (task.actualHours || 0), 0)
          }
        ]
      };
      
      console.log("✅ 분석 데이터 생성 완료");
      return res.json(analytics);
    }
    // DB 접근 실패시 기본 응답
    return res.json({
      totalProjects: 0,
      completedProjects: 0,
      inProgressProjects: 0,
      notStartedProjects: 0,
      overallProgress: 0,
      totalTasks: 0,
      completedTasks: 0,
      taskCompletionRate: 0,
      totalBudget: 0,
      totalSpent: 0,
      budgetUtilization: 0,
      mostActiveUsers: []
    });
  }

  // ✅ 10. 특정 프로젝트의 태스크 조회 (GET /projects/:id/tasks)
  if (req.url.match(/^\/projects\/(\d+)\/tasks$/) && req.method === "GET") {
    const projectId = parseInt(req.url.match(/^\/projects\/(\d+)\/tasks$/)[1]);
    console.log("🚀 프로젝트 태스크 조회:", projectId);
    
    const db = getDbData();
    if (db && db.tasks) {
      const projectTasks = db.tasks.filter(task => task.projectId === projectId);
      console.log(`✅ 태스크 조회 결과: ${projectTasks.length}개`);
      return res.json(projectTasks);
    }
    return res.json([]);
  }

  // ✅ 11. 특정 프로젝트의 활동 로그 조회 (GET /projects/:id/activities)
  if (req.url.match(/^\/projects\/(\d+)\/activities$/) && req.method === "GET") {
    const projectId = parseInt(req.url.match(/^\/projects\/(\d+)\/activities$/)[1]);
    console.log("🚀 프로젝트 활동 로그 조회:", projectId);
    
    const db = getDbData();
    if (db && db.projects) {
      const project = db.projects.find(p => p.id === projectId);
      const activities = project ? project.activities || [] : [];
      
      console.log(`✅ 활동 로그 조회 결과: ${activities.length}개`);
      return res.json(activities);
    }
    return res.json([]);
  }

  // ✅ 12. 특정 프로젝트의 파일 조회 (GET /projects/:id/files)
  if (req.url.match(/^\/projects\/(\d+)\/files$/) && req.method === "GET") {
    const projectId = parseInt(req.url.match(/^\/projects\/(\d+)\/files$/)[1]);
    console.log("🚀 프로젝트 파일 조회:", projectId);
    
    const db = getDbData();
    if (db && db.projects) {
      const project = db.projects.find(p => p.id === projectId);
      const files = project ? project.files || [] : [];
      
      console.log(`✅ 파일 조회 결과: ${files.length}개`);
      return res.json(files);
    }
    return res.json([]);
  }

  // =========================
  // 📋 TASKS ENDPOINTS (DB 기반)
  // =========================

  // ✅ 1. 모든 태스크 조회 (GET /tasks)
  if (req.url === "/tasks" && req.method === "GET") {
    console.log("📋 모든 태스크 조회 요청");
    const db = getDbData();
    if (db && db.tasks) {
      return res.json(db.tasks);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 2. 특정 태스크 조회 (GET /tasks/:id)
  if (req.url.match(/^\/tasks\/(\d+)$/) && req.method === "GET") {
    const taskId = parseInt(req.url.match(/^\/tasks\/(\d+)$/)[1]);
    console.log("📋 특정 태스크 조회 요청:", taskId);
    
    const db = getDbData();
    if (db && db.tasks) {
      const task = db.tasks.find(t => t.id === taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json(task);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 3. 태스크 생성 (POST /tasks)
  if (req.url === "/tasks" && req.method === "POST") {
    console.log("📋 태스크 생성 요청:", req.body);
    
    const db = getDbData();
    if (db && db.tasks && db.projects) {
      const newTask = {
        id: Math.max(...db.tasks.map(t => t.id), 0) + 1,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      db.tasks.push(newTask);
      
      // 해당 프로젝트의 태스크 목록에도 추가
      if (newTask.projectId) {
        const projectIndex = db.projects.findIndex(p => p.id === newTask.projectId);
        if (projectIndex !== -1) {
          if (!db.projects[projectIndex].tasks) {
            db.projects[projectIndex].tasks = [];
          }
          db.projects[projectIndex].tasks.push(newTask);
          db.projects[projectIndex].updatedAt = new Date().toISOString();
        }
      }
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 태스크 생성 완료:", newTask.title);
      return res.status(201).json(newTask);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 4. 태스크 수정 (PUT /tasks/:id)
  if (req.url.match(/^\/tasks\/(\d+)$/) && req.method === "PUT") {
    const taskId = parseInt(req.url.match(/^\/tasks\/(\d+)$/)[1]);
    console.log("📋 태스크 수정 요청:", taskId, req.body);
    
    const db = getDbData();
    if (db && db.tasks && db.projects) {
      const taskIndex = db.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const originalTask = db.tasks[taskIndex];
      db.tasks[taskIndex] = {
        ...originalTask,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      // 해당 프로젝트의 태스크도 업데이트
      if (originalTask.projectId) {
        const projectIndex = db.projects.findIndex(p => p.id === originalTask.projectId);
        if (projectIndex !== -1 && db.projects[projectIndex].tasks) {
          const projectTaskIndex = db.projects[projectIndex].tasks.findIndex(t => t.id === taskId);
          if (projectTaskIndex !== -1) {
            db.projects[projectIndex].tasks[projectTaskIndex] = db.tasks[taskIndex];
            db.projects[projectIndex].updatedAt = new Date().toISOString();
          }
        }
      }
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 태스크 수정 완료:", db.tasks[taskIndex].title);
      return res.json(db.tasks[taskIndex]);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 5. 태스크 삭제 (DELETE /tasks/:id)
  if (req.url.match(/^\/tasks\/(\d+)$/) && req.method === "DELETE") {
    const taskId = parseInt(req.url.match(/^\/tasks\/(\d+)$/)[1]);
    console.log("📋 태스크 삭제 요청:", taskId);
    
    const db = getDbData();
    if (db && db.tasks && db.projects) {
      const taskIndex = db.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const deletedTask = db.tasks.splice(taskIndex, 1)[0];
      
      // 해당 프로젝트의 태스크 목록에서도 제거
      if (deletedTask.projectId) {
        const projectIndex = db.projects.findIndex(p => p.id === deletedTask.projectId);
        if (projectIndex !== -1 && db.projects[projectIndex].tasks) {
          db.projects[projectIndex].tasks = db.projects[projectIndex].tasks.filter(t => t.id !== taskId);
          db.projects[projectIndex].updatedAt = new Date().toISOString();
        }
      }
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 태스크 삭제 완료:", deletedTask.title);
      return res.status(204).end();
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 6. 사용자별 태스크 조회 (GET /tasks/user/:userId)
  if (req.url.match(/^\/tasks\/user\/(\d+)$/) && req.method === "GET") {
    const userId = parseInt(req.url.match(/^\/tasks\/user\/(\d+)$/)[1]);
    console.log("📋 사용자별 태스크 조회:", userId);
    
    const db = getDbData();
    if (db && db.tasks) {
      const userTasks = db.tasks.filter(task => 
        task.assigneeId === userId || task.assignee?.id === userId
      );
      
      console.log(`✅ 사용자 태스크 조회 결과: ${userTasks.length}개`);
      return res.json(userTasks);
    }
    return res.json([]);
  }

  // ✅ 7. 태스크 상태 변경 (PATCH /tasks/:id/status)
  if (req.url.match(/^\/tasks\/(\d+)\/status$/) && req.method === "PATCH") {
    const taskId = parseInt(req.url.match(/^\/tasks\/(\d+)\/status$/)[1]);
    console.log("📋 태스크 상태 변경 요청:", taskId, req.body);
    
    const db = getDbData();
    if (db && db.tasks && db.projects) {
      const taskIndex = db.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const originalTask = db.tasks[taskIndex];
      db.tasks[taskIndex] = {
        ...originalTask,
        status: req.body.status,
        updatedAt: new Date().toISOString()
      };
      
      // 해당 프로젝트의 태스크도 업데이트
      if (originalTask.projectId) {
        const projectIndex = db.projects.findIndex(p => p.id === originalTask.projectId);
        if (projectIndex !== -1 && db.projects[projectIndex].tasks) {
          const projectTaskIndex = db.projects[projectIndex].tasks.findIndex(t => t.id === taskId);
          if (projectTaskIndex !== -1) {
            db.projects[projectIndex].tasks[projectTaskIndex] = db.tasks[taskIndex];
            db.projects[projectIndex].updatedAt = new Date().toISOString();
          }
        }
      }
      
      // JSON Server에 변경사항 저장
      if (req.app.db && req.app.db.write) {
        req.app.db.write();
      }
      
      console.log("✅ 태스크 상태 변경 완료:", db.tasks[taskIndex].status);
      return res.json(db.tasks[taskIndex]);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // =========================
  // 👥 USERS ENDPOINTS (DB 기반)
  // =========================

  // ✅ 1. 모든 사용자 조회 (GET /users)
  if (req.url === "/users" && req.method === "GET") {
    console.log("👥 모든 사용자 조회 요청");
    const db = getDbData();
    if (db && db.users) {
      return res.json(db.users);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 2. 특정 사용자 조회 (GET /users/:id)
  if (req.url.match(/^\/users\/(\d+)$/) && req.method === "GET") {
    const userId = parseInt(req.url.match(/^\/users\/(\d+)$/)[1]);
    console.log("👥 특정 사용자 조회 요청:", userId);
    
    const db = getDbData();
    if (db && db.users) {
      const user = db.users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    }
    // DB 접근 실패시 JSON Server로 넘김
  }

  // ✅ 3. 사용자별 프로젝트 분석 (GET /users/:id/analytics)
  if (req.url.match(/^\/users\/(\d+)\/analytics$/) && req.method === "GET") {
    const userId = parseInt(req.url.match(/^\/users\/(\d+)\/analytics$/)[1]);
    console.log("👥 사용자별 프로젝트 분석 요청:", userId);
    
    const db = getDbData();
    if (db && db.projects && db.tasks) {
      const userProjects = db.projects.filter(project => 
        project.ownerId === userId || 
        project.teamMembers?.some(member => member.userId === userId)
      );
      
      const userTasks = db.tasks.filter(task => 
        task.assigneeId === userId || task.assignee?.id === userId
      );
      
      const analytics = {
        userId,
        totalProjects: userProjects.length,
        ownedProjects: db.projects.filter(p => p.ownerId === userId).length,
        participatingProjects: userProjects.filter(p => p.ownerId !== userId).length,
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter(t => t.status === 'completed').length,
        inProgressTasks: userTasks.filter(t => t.status === 'in-progress').length,
        totalHoursWorked: userTasks.reduce((acc, task) => acc + (task.actualHours || 0), 0),
        taskCompletionRate: userTasks.length > 0 ? 
          (userTasks.filter(t => t.status === 'completed').length / userTasks.length) * 100 : 0
      };
      
      console.log("✅ 사용자 분석 데이터 생성 완료");
      return res.json(analytics);
    }
    return res.json({
      userId,
      totalProjects: 0,
      ownedProjects: 0,
      participatingProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      totalHoursWorked: 0,
      taskCompletionRate: 0
    });
  }

  // =========================
  // 🔍 CONNECTION TEST
  // =========================

  // ✅ 연결 테스트 (GET /test-connection)
  if (req.url === "/test-connection" && req.method === "GET") {
    console.log("🔍 연결 테스트 요청");
    return res.json({
      success: true,
      message: "서버 연결이 정상입니다",
      timestamp: new Date().toISOString(),
      server: "Mock API Server",
      version: "1.0.0"
    });
  }

  // ✅ Health Check
  if (req.url === "/health" && req.method === "GET") {
    const db = getDbData();
    return res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      services: {
        auth: "running",
        books: "running",
        projects: "running",
        tasks: "running",
        users: "running"
      },
      mockData: {
        booksCount: db?.books?.length || 0,
        activeBooks: db?.books?.filter(b => b.studyPeriodActive).length || 0,
        projectsCount: db?.projects?.length || 0,
        activeProjects: db?.projects?.filter(p => p.status === 'in-progress').length || 0,
        tasksCount: db?.tasks?.length || 0,
        usersCount: db?.users?.length || 0
      }
    });
  }

  // 다음 미들웨어로 전달 (JSON Server 처리를 위해)
  next();
};