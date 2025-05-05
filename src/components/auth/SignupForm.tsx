import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface SignupFormData {
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
}

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  checkNicknameAvailability: (nickname: string) => Promise<boolean>;
}

const schema = z.object({
  email: z.string().email('유효하지 않은 이메일 형식입니다.'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .regex(/[A-Za-z]/, '영문자를 포함해야 합니다.')
    .regex(/[0-9]/, '숫자를 포함해야 합니다.')
    .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다.'),
  confirmPassword: z.string(),
  nickname: z.string().min(1, '닉네임을 입력해 주세요.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 맞지 않습니다.',
  path: ['confirmPassword'],
});

const SignupForm = ({ onSubmit, checkNicknameAvailability }: SignupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({ resolver: zodResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNicknameCheck = async (nickname: string) => {
    const isAvailable = await checkNicknameAvailability(nickname);
    if (!isAvailable) {
      setError('nickname', { message: '이미 사용 중인 닉네임입니다.' });
    } else {
      alert('사용 가능한 닉네임입니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full max-w-xs mx-auto">
        <h1 className="text-center text-[26px] font-bold text-[#543122] mt-12 mb-8">CafeBoo</h1>

        {/* 닉네임 */}
        <div>
            <label className="text-base font-semibold text-[#56433C] block mb-2">닉네임</label>
            <div className="flex items-center gap-2">
                <input
                type="text"
                placeholder="닉네임"
                {...register('nickname')}
                className="flex-grow min-w-0 py-2 px-4 rounded-lg text-base border text-[#56433C] bg-white border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#543122]"
                />
                <button
                type="button"
                onClick={() => handleNicknameCheck((document.querySelector('[name=nickname]') as HTMLInputElement)?.value)}
                className="flex-shrink-0 w-20 py-2 rounded-lg bg-[#543122] text-white text-base font-light truncate"  
                >
                중복확인
                </button>
            </div>
            {errors.nickname && (
                <p className="text-[13px] text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.nickname.message}
                </p>
            )}
        </div>

        {/* 이메일 */}
        <div>
            <label className="text-base font-semibold text-[#56433C] block mb-2">이메일</label>
            <input
            type="email"
            placeholder="이메일"
            {...register('email')}
            className="w-full py-2 px-4 rounded-lg text-base border text-[#56433C] bg-white border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#543122]"
            />
            {errors.email && (
                <p className="text-[13px] text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                </p>
            )}
        </div>

        {/* 비밀번호 */}
        <div>
            <label className="text-base font-semibold text-[#56433C] block mb-2">비밀번호</label>
            <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                {...register('password')}
                className="w-full py-2 px-4 pr-10 rounded-lg text-base border text-[#56433C] bg-white border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#543122]"
            />
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#C7C7CC] cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
            </div>
            {errors.password && (
                <p className="text-[13px] text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                </p>
            )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
            <label className="text-base font-semibold text-[#56433C] block mb-2">비밀번호 확인</label>
            <div className="relative">
            <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                {...register('confirmPassword')}
                className="w-full py-2 px-4 pr-10 rounded-lg text-base border text-[#56433C] bg-white border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#543122]"
            />
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#C7C7CC] cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
            </div>
            {errors.confirmPassword && (
                <p className="text-[13px] text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword.message}
                </p>
            )}
        </div>

        {/* 하단 안내 및 버튼 */}
     
        <p className="text-base text-[#595959] text-center">
            이미 계정이 있으신가요?{' '}
            <a href="/auth/login" className="text-[#FF8F00] font-semibold">
                로그인
            </a>
        </p>
        <button
            type="submit"
            className="w-full py-2 rounded-lg text-base bg-[#543122] text-[#FEFBF8] font-semibold mt-2"
        >
            회원가입
        </button>
     
    </form>

  );
};

export default SignupForm;

