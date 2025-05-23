import { useState } from "preact/hooks";
import { FunctionComponent } from "preact";
import { JSX } from "preact";

const Form: FunctionComponent = () => {
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number | undefined>();
  const [email, setEmail] = useState<string>("");

  const submitHandler = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault(); 

    const errorMsg: string[] = [];

    if (!age || age < 18) {
      errorMsg.push("Mayor de 18 tete");
    }
    if (name.trim() === "") {
      errorMsg.push("Pon tu nombre");
    }
    if (email.trim() === "") {
      errorMsg.push("No seas vago pon el email");
    }

    if (errorMsg.length > 0) {
      setError(errorMsg.join(" | "));
    } else {
      setError("");

      // Enviar al backend del registro
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("age", age?.toString() || "");

      try {
        const res = await fetch("/api/register", {
          method: "POST", // Método POST para enviar datos al servidor
          body: formData, // Los datos se envían como FormData
        });

        if (!res.ok) {
          const msg = await res.text();
          setError("Error: " + msg);
          return;
        }

        // Esperamos que devuelva el user con _id
        const data = await res.json();
        const user = {
          id: data.id,
          name,
          email,
          age,
          bets: 1000,
        };

        localStorage.setItem("user", JSON.stringify(user));// Guardar el usuario en localStorage (el localStrorage sirve para guardar datos en el navegador del cliente)
        localStorage.setItem("bets", JSON.stringify(user.bets)); // Guardar las apuestas en localStorage
        location.href = "/main";  // Redirigir después del registro

      } catch (err) {
        setError("Unexpected error: " + err);
      }
    }
  };

  return (
    <div class="form">
      <h1>Introduce tus datos</h1>
      <form onSubmit={submitHandler}> {}
        <div>
          <label for="name">Name</label>
        </div>
        <div>
          <input
            onFocus={() => setError("")}
            onInput={(e) => setName(e.currentTarget.value)}
            type="text"
            id="name"
            name="name"
          />
        </div>

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
          <label for="age">Age</label>
        </div>
        <div>
          <input
            onFocus={() => setError("")}
            type="number"
            id="age"
            name="age"
            onInput={(e) => setAge(Number(e.currentTarget.value))}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={error !== ""}
            class="btn"
          >
            Submit
          </button>
        </div>
        <div>
          <button
            type="reset"
            class="reset"
            onClick={(e) => {
              setName("");
              setEmail("");
              setAge(undefined);
              setError("");
            }}
          >
            Reset
          </button>
        </div>
        {error !== "" && <div class="span-2 error">{error}</div>}
      </form>
    </div>
  );
};

export default Form;