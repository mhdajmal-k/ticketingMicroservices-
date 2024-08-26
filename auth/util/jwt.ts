import jwt from "jsonwebtoken";

if (!process.env.JWT_KEY) {
  throw new Error("jwt not defined");
}

const tokenCreation = (userId: string, userEmail: string) => {
  console.log(process.env.JWT_KEY); // kubectl create secret generic jwt-secret --from-literal=JWT_KEY=""
  const tok = jwt.sign(
    {
      id: userId,
      email: userEmail,
    },
    process.env.JWT_KEY!,
    {
      expiresIn: "1h",
    }
  );
  return tok;
};

export { tokenCreation };
