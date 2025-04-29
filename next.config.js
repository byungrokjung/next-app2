/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supabase 패키지를 Next.js가 처리하도록 설정
  transpilePackages: ['@supabase/supabase-js']
}

module.exports = nextConfig 