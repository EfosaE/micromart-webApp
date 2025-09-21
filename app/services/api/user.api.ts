import { createCookie, ErrorResponse } from 'react-router';
import {
  isSuccessResponse,
  isErrorResponse,
  isUserWithAccessToken,
  SuccessResponse,
  User,
} from '~/types';
import { initializeRedis } from '../redis.server';
import { getAccessToken, getUserDataFromSession } from '../session.server';
import { getNewToken, getUserProfile } from './auth.api';

async function getUserDataFromBE(request: Request) {
  const access_token = await getAccessToken(request);
  if (access_token) {
    // call profile endpoint for new user details
    const response = await getUserProfile(access_token);
    console.log('getUserProfile', response);
    return response;
  }
  // return 403 so refresh endpoint is called by the layout loader for new accesstoken and new user details using refresh cookie
  return { success: false, error: 'no access token', statusCode: 403 };
}

export async function getUser(request: Request): Promise<User |null> {
  // 1. Try getting user from session
  const user = await getUserDataFromSession(request);
  console.log('session called', user);
  if (user) {
    return user;
  }

  // 2. If no session, call the backend to fetch user
  const response = await getUserDataFromBE(request);

  if (isSuccessResponse(response)) {
    return response.data; // Return user directly if successful
  }

  // 3. If backend returns error, check for refresh token
  if (isErrorResponse(response)) {
    return null;
    // const cookiesHeader = request.headers.get('cookie');
    // const refreshTokenCookie = createCookie('refresh_token');
    // const refresh_token = await refreshTokenCookie.parse(cookiesHeader);
    // // 4. Try refreshing the token if refresh token exists
    // if (refresh_token) {
    //   const response = await getNewToken(refresh_token);
    //   console.log('getNewToken', response);
    //   if (isUserWithAccessToken(response)) {
    //     const { user, accessToken } = response;
    //     return { user, accessToken };
    //   } else {
    //     return null;
    //   }
    // }
  }
  return null;
}
