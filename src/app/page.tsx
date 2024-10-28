import Image from "next/image"

export default function Home() {
  return (
    <>
      <a
        href="
https://github.com/login/oauth/authorize?access_type=offline&client_id=Iv23liOQr37Slwu2DYMV&prompt=consent&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth_callback&response_type=code&scope=read%3Auser+user%3Aemail"
      >
        GitHub
      </a>
    </>
  )
}
