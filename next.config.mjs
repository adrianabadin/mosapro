/** @type {import('next').NextConfig} */


const nextconfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'drive.google.com',
          port: '',
          pathname: '/**',
        },
      ],
    },typescript:{ignoreBuildErrors:true}
  }

export default nextconfig