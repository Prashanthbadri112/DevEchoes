import { type SigninInput, type SignupInput } from '@prashanthbadri/medium-common';
import axios from 'axios';
import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

export const Auth = ({ type }: { type: 'signup' | 'signin' }) => {
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const sendRequest = async () => {
    try {
      const payload =
        type === 'signup' ? postInputs : { email: postInputs.email, password: postInputs.password };
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === 'signup' ? 'signup' : 'signin'}`,
        payload as SigninInput | SignupInput,
      );
      const jwt = response.data.jwt;
      localStorage.setItem('token', jwt);
      navigate('/blogs');
    } catch (err) {
      alert(`Error during authentication ${type === 'signup' ? 'signup' : 'signin'}: ${err}`);
      console.error('Error during authentication:', err);
    }
  };

  return (
    <div className='h-screen flex justify-center flex-col'>
      <div className='flex justify-center'>
        <div>
          <div className='px-10'>
            <div className='text-3xl font-extrabold'>Create an Account</div>
            <div className='text-slate-400 pl-2'>
              {type === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <Link className='pl-2 underline' to={type === 'signin' ? '/signup' : '/signin'}>
                {type === 'signin' ? 'Sign up' : 'Sign in'}
              </Link>
            </div>
          </div>
          <div className='pt-8'>
            {type === 'signup' ? (
              <LabelledInput
                label='Username'
                placeholder='Enter the username'
                onChange={(e) => {
                  setPostInputs((inputs) => ({
                    ...inputs,
                    name: e.target.value,
                  }));
                }}
              />
            ) : null}

            <LabelledInput
              label='Email'
              placeholder='email@example.com'
              onChange={(e) => {
                setPostInputs((inputs) => ({
                  ...inputs,
                  email: e.target.value,
                }));
              }}
            />
            <LabelledInput
              label='Password'
              type={'password'}
              placeholder='Enter the password'
              onChange={(e) => {
                setPostInputs((inputs) => ({
                  ...inputs,
                  password: e.target.value,
                }));
              }}
            />
            <button
              onClick={sendRequest}
              type='button'
              className='mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
            >
              {type === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ILabelledInputProps {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({ label, placeholder, type, onChange }: ILabelledInputProps) {
  return (
    <div>
      <div>
        <label className='block mb-2 pt-2 text-sm font-semibold text-black'>{label}</label>
        <input
          type={type || 'text'}
          id='first_name'
          onChange={onChange}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}
