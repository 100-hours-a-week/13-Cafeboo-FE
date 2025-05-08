import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Info } from 'lucide-react'
import AlertModal from '@/components/common/AlertModal'

export interface LoginFormData {
  email: string
  password: string
}

interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<void>
}

const schema = z.object({
  email:    z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [showModal, setShowModal] = useState(false)

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) })

  return (
    <>
      <form className="space-y-4 w-full max-w-xs mx-auto">
        <h1 className="text-center text-[26px] font-bold text-[#000000] mt-12 mb-8">
          CafeBoo
        </h1>

        <input
          type="email"
          placeholder="아이디"
          {...register('email')}
          className="w-full py-2 px-4 rounded-lg border text-base text-[#56433C] bg-[#FFFFFF] border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#FE9400]"
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
          className="w-full py-2 px-4 rounded-lg border text-base text-[#56433C] bg-[#FFFFFF] border-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#FE9400]"
        />
        
        {errors.password && (
          <p className="text-[13px] text-red-500 mt-[-10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password.message}
          </p>
        )}

        {/* 나중에 type="submit"으로 변경 */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full py-2 rounded-lg bg-[#FE9400] text-[#FEFBF8] font-semibold mt-2 cursor-pointer"
        >
          로그인
        </button>
      </form>

      {/* 소셜로그인 안내 모달 */}
      <AlertModal
        isOpen={showModal}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="로그인 안내"
        message="현재는 소셜 로그인만 지원합니다."
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        confirmText="확인"
        showCancelButton={false}
      />
    </>
  )
}

export default LoginForm
