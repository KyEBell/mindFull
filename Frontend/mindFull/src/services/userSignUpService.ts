const url = 'http://localhost:3000/api/signup/';

interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
}

async function userSignUpService(
  username: string,
  email: string,
  password: string
): Promise<SignUpResponse> {
  try {
    console.log('username', username, 'password', password);
    const response = await fetch(url, {
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
