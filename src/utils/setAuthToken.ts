import axios from 'axios';
const setAuthToken = (token: string) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        localStorage.setItem('token', token);
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
        localStorage.removeItem('token');
        localStorage.removeItem('isLawyer');
    }
};

export const setId = (id: string) => {
    if (id) {
        localStorage.setItem('id', id);
    } else {
        localStorage.removeItem('id');
    }
};

export const setLawyer= (isLawyer: any) => {
    if (isLawyer) {
        localStorage.setItem('isLawyer', isLawyer);
    } else {
        localStorage.removeItem('isLawyer');
    }
};


export default setAuthToken;
