const signUpUrl = import.meta.env.VITE_BASE_API_URL + 'signup';

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}
interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

async function userSignUpService(
  username: string,
  email: string,
  password: string
): Promise<SignUpResponse> {
  try {
    console.log('username', username, 'password', password);
    const response = await fetch(signUpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('SignUp Failed');
    }

    console.log('response from login service', response);
    const data: SignUpResponse = await response.json();
    console.log('Parsed data:', data);

    return data;
  } catch (error) {
    console.error('Login Error', error);
    throw new Error('Login Failed');
  }
}

export default userSignUpService;
