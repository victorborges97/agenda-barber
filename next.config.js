/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_APIKEY: process.env.NEXT_APIKEY,
    NEXT_AUTHDOMAIN: process.env.NEXT_AUTHDOMAIN,
    NEXT_PROJECTID: process.env.NEXT_PROJECTID,
    NEXT_STORAGE_BUCKET: process.env.NEXT_STORAGE_BUCKET,
    NEXT_MESSAGING_SENDER_ID: process.env.NEXT_MESSAGING_SENDER_ID,
    NEXT_APP_ID: process.env.NEXT_APP_ID,
  }
}

module.exports = nextConfig
