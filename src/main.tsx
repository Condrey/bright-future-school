import { hash } from "@node-rs/argon2";

async function main(): Promise<void> {
  const passwordHash = await hash("passover", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  console.log(passwordHash);
}
main();
