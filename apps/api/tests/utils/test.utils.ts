import { auth } from "@/auth";

export async function createTestUser() {
	const authCtx = await auth.$context;
	const authTest = authCtx.test;

	const user = authTest.createUser({
		id: Bun.randomUUIDv7(),
	});
	const savedUser = await authTest.saveUser(user);
	const loginResult = await authTest.login({ userId: savedUser.id });
	return loginResult;
}
