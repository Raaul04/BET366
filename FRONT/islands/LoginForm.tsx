import { useState } from "preact/hooks";
import { FunctionComponent } from "preact";
import { JSX } from "preact";

const LoginForm: FunctionComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const submitHandler = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "") {
      setError("Pon tu email, tete");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError("Error: " + msg);
        return;
      }
      

      const data = await res.json();
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        age: data.age,
        bets: data.bets,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("bets", JSON.stringify(user.bets));
      location.href = "/main";

    } catch (err) {
      setError("Unexpected error: " + err);
    }
  };

  return (
    <div class="form">
      <h1>Inicia sesión</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label for="email">Email</label>
        </div>
        <div>
          <input
            onFocus={() => setError("")}
            onInput={(e) => setEmail(e.currentTarget.value)}
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div>
          <button type="submit" class="btn">Entrar</button>
        </div>
        {error !== "" && <div class="span-2 error">{error}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
