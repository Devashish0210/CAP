import LoginCard from "./login-card";

const LoginPage = () => {
  return (
    <>
      <section className="h-[90vh] w-full">
        <div
          className="absolute h-full w-full blur-md -z-40"
          style={{
            backgroundImage: "url('background-login.jpg')",
            backgroundSize: "100vw 90vh",
          }}
        />
        <div className="w-full flex flex-wrap h-full items-center justify-evenly">
          <div className="text-[3rem] pr-24">
            <h1>Welcome to</h1>
            <h1>Microland Alumni</h1>
            <h1>Community</h1>
          </div>
          <div>
            <LoginCard />
          </div>
        </div>
      </section>
    </>
  );
};
export default LoginPage;
