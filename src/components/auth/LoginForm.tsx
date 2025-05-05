import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<void>;
}

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-4 w-full max-w-xs mx-auto">
      <h1 className="text-center text-[26px] font-bold text-[#543122] mt-12 mb-8">CafeBoo</h1>

      <input
        type="email"
        placeholder="아이디"
        {...register('email')}
        className="w-full py-2 px-4 rounded-lg border text-base text-[#56433C] bg-[#FFFFFF] border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#543122]"
      />
      {errors.email && (
              <p className="text-[13px] text-red-500 mt-[-10px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
            </p>
      )}

      <input
        type="password"
        placeholder="비밀번호"
        {...register('password')}
        className="w-full py-2 px-4 rounded-lg border text-base text-[#56433C] bg-[#FFFFFF] border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#543122]"
      />
      {errors.password && (
              <p className="text-[13px] text-red-500 mt-[-10px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password.message}
            </p>
      )}

      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-[#543122] text-[#FEFBF8] font-semibold mt-2"
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;