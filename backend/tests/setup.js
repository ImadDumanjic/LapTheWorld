// Loaded via --import before any test module is evaluated.
// Sets every process.env var the app reads at module-load time so Sequelize
// constructs its instance and all constants are initialised without a real DB.
process.env.NODE_ENV            = 'test'
process.env.DATABASE_URL        = 'postgres://postgres:postgres@localhost:5432/laptheworld_test'
process.env.DB_HOST             = 'localhost'
process.env.DB_PORT             = '5432'
process.env.JWT_SECRET          = 'test-jwt-secret-laptheworld-testing-only'
process.env.JWT_EXPIRES_IN      = '1h'
process.env.MAX_FAILED_ATTEMPTS = '5'
process.env.LOCK_DURATION_MS    = '900000'
process.env.SALT_ROUNDS         = '1'    // keeps bcrypt fast in tests
process.env.ADMIN_EMAIL         = 'admin@test.com'
process.env.GMAIL_SENDER_EMAIL  = 'noreply@test.com'
process.env.GMAIL_CLIENT_ID     = 'test-client-id'
process.env.GMAIL_CLIENT_SECRET = 'test-client-secret'
process.env.GMAIL_REFRESH_TOKEN = 'test-refresh-token'
process.env.GROQ_API_KEY        = 'test-groq-key'
process.env.GOOGLE_CLIENT_ID    = 'test-google-client-id'
process.env.FRONTEND_URL        = 'http://localhost:5173'
