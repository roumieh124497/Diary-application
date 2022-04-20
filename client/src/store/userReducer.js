import Cookies from 'universal-cookie';

const cookies = new Cookies();
const userInfo = cookies.get('user-info');
const user = {
  fullName: userInfo?.fullName || '',
  email: userInfo?.email || '',
};
const changeUserInfo = 'changeUserInfo';

const userReducer = (state = user, action) => {
  if (action.type === changeUserInfo) {
    return {
      fullName: action.payload.fullName,
      email: action.payload.email,
    };
  }

  return state;
};

export default userReducer;
