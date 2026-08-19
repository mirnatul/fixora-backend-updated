import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    port: process.env.PORT || 5000,
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    backend_url: process.env.BACKEND_URL,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRATION!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRATION!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
    google_client_id: process.env.GOOGLE_CLIENT_ID!,
}
