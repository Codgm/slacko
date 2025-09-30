const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const customMiddleware = require("./middleware");

// 포트 설정
const PORT = process.env.PORT || 3001;

// 기본 미들웨어 적용 (CORS, 정적 파일 등)
server.use(middlewares);

// 커스텀 헤더 및 CORS 설정 강화
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning");
  res.header("ngrok-skip-browser-warning", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// JSON Server body parser
server.use(jsonServer.bodyParser);

// ✅ DB 인스턴스를 앱에 연결 (중요!)
server.use((req, res, next) => {
  req.app.db = router.db;
  next();
});

// ✅ 커스텀 미들웨어 적용 (DB 설정 후, 라우터 전)
server.use(customMiddleware);

// Health Check 엔드포인트
server.get('/health', (req, res) => {
  const db = router.db.getState();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      auth: "running",
      books: "running",
      projects: "running",
      jsonServer: "running"
    },
    mockData: {
      booksCount: db.books ? db.books.length : 0,
      activeBooks: db.books ? db.books.filter(b => b.studyPeriodActive).length : 0,
      projectsCount: db.projects ? db.projects.length : 0,
      activeProjects: db.projects ? db.projects.filter(p => p.status === 'in-progress').length : 0,
      tasksCount: db.tasks ? db.tasks.length : 0,
      usersCount: db.users ? db.users.length : 0
    },
    server: "JSON Server with Custom Middleware",
    port: PORT
  });
});

// 루트 경로 - 서버 정보 제공
server.get('/', (req, res) => {
  res.json({
    name: "프로젝트 관리 시스템 Mock API Server",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: [
        "GET  /api/auth/oauth2/google",
        "GET  /auth/google/callback",
        "POST /api/auth/exchange-token", 
        "GET  /api/auth/me",
        "POST /api/auth/validate",
        "POST /api/auth/refresh",
        "POST /api/auth/logout"
      ],
      projects: [
        "GET    /api/projects",
        "POST   /api/projects", 
        "GET    /api/projects/:id",
        "PUT    /api/projects/:id",
        "DELETE /api/projects/:id",
        "GET    /api/projects/search?q=",
        "GET    /api/projects/analytics",
        "GET    /api/projects/:id/tasks",
        "GET    /api/projects/:id/activities",
        "GET    /api/projects/:id/files"
      ],
      tasks: [
        "GET    /api/tasks",
        "POST   /api/tasks",
        "GET    /api/tasks/:id",
        "PUT    /api/tasks/:id",
        "DELETE /api/tasks/:id",
        "PATCH  /api/tasks/:id/status",
        "GET    /api/tasks/user/:userId"
      ],
      users: [
        "GET    /api/users",
        "GET    /api/users/:id",
        "GET    /api/users/:id/analytics"
      ]
    },
    testUrls: [
      `http://localhost:${PORT}/api/projects`,
      `http://localhost:${PORT}/api/projects/analytics`,
      `http://localhost:${PORT}/api/tasks`,
      `http://localhost:${PORT}/api/users`,
      `http://localhost:${PORT}/health`
    ]
  });
});

// ✅ JSON Server 라우터 적용 (가장 마지막, /api prefix 추가)
server.use("/api", router);

// 404 에러 핸들링
server.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `경로 '${req.url}'를 찾을 수 없습니다.`,
    availableEndpoints: [
      "GET  /api/projects",
      "POST /api/projects",
      "GET  /api/projects/:id", 
      "PUT  /api/projects/:id",
      "DELETE /api/projects/:id",
      "GET  /api/projects/search?q=",
      "GET  /api/projects/analytics",
      "GET  /api/tasks",
      "POST /api/tasks",
      "GET  /api/users",
      "GET  /health"
    ]
  });
});

// 에러 핸들링 미들웨어
server.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: "Internal Server Error",
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log("\n🚀 ========================================");
  console.log(`   프로젝트 관리 시스템 Mock API Server`);
  console.log("   ========================================");
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`🗃️ Database: db.json`);
  console.log(`🔧 Mode: JSON Server with Custom Middleware\n`);
  
  console.log("🚀 Available Projects Endpoints:");
  console.log(`   - GET    http://localhost:${PORT}/api/projects`);
  console.log(`   - POST   http://localhost:${PORT}/api/projects`);
  console.log(`   - GET    http://localhost:${PORT}/api/projects/:id`);
  console.log(`   - PUT    http://localhost:${PORT}/api/projects/:id`);
  console.log(`   - DELETE http://localhost:${PORT}/api/projects/:id`);
  console.log(`   - GET    http://localhost:${PORT}/api/projects/search?q=`);
  console.log(`   - GET    http://localhost:${PORT}/api/projects/analytics`);
  console.log(`   - GET    http://localhost:${PORT}/api/projects/:id/tasks`);
  console.log(`   - GET    http://localhost:${PORT}/api/projects/:id/activities`);
  console.log(`   - GET    http://localhost:${PORT}/api/projects/:id/files`);
  
  console.log("\n📋 Available Tasks Endpoints:");
  console.log(`   - GET    http://localhost:${PORT}/api/tasks`);
  console.log(`   - POST   http://localhost:${PORT}/api/tasks`);
  console.log(`   - GET    http://localhost:${PORT}/api/tasks/:id`);
  console.log(`   - PUT    http://localhost:${PORT}/api/tasks/:id`);
  console.log(`   - DELETE http://localhost:${PORT}/api/tasks/:id`);
  console.log(`   - PATCH  http://localhost:${PORT}/api/tasks/:id/status`);
  console.log(`   - GET    http://localhost:${PORT}/api/tasks/user/:userId`);
  
  console.log("\n👥 Available Users Endpoints:");
  console.log(`   - GET    http://localhost:${PORT}/api/users`);
  console.log(`   - GET    http://localhost:${PORT}/api/users/:id`);
  console.log(`   - GET    http://localhost:${PORT}/api/users/:id/analytics`);
  
  console.log("\n🔐 Available Auth Endpoints:");
  console.log(`   - GET  http://localhost:${PORT}/api/auth/oauth2/google`);
  console.log(`   - GET  http://localhost:${PORT}/auth/google/callback`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/exchange-token`);
  console.log(`   - GET  http://localhost:${PORT}/api/auth/me`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/validate`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/refresh`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/logout`);
  
  console.log("\n🎯 Quick Test URLs:");
  console.log(`   - http://localhost:${PORT}/`);
  console.log(`   - http://localhost:${PORT}/health`);
  console.log(`   - http://localhost:${PORT}/api/projects`);
  console.log(`   - http://localhost:${PORT}/api/projects/analytics`);
  console.log(`   - http://localhost:${PORT}/api/tasks`);
  console.log("========================================\n");
});

// 프로세스 종료 처리
process.on('SIGTERM', () => {
  console.log('\n📴 서버가 종료됩니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📴 서버가 종료됩니다...');
  process.exit(0);
});