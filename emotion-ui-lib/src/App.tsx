import { Toast } from './components/Toast'
import { DataTable } from './components/DataTable'
import './App.css'

function App() {
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 테이블 외부에 알림 표시 */}
        {[
          {
            name: '홍길동',
            email: 'hong@domain.com',
            role: '관리자',
            status: '활성',
            signupDate: '2024-05-01',
          },
          {
            name: '김철수',
            email: 'kim@domain.com',
            role: '일반 사용자',
            status: '비활성',
            signupDate: '2024-03-15',
          },
          {
            name: '이영희',
            email: 'lee@domain.com',
            role: '에디터',
            status: '활성',
            signupDate: '2024-01-22',
          },
          {
            name: '박민수',
            email: 'park@domain.com',
            role: '관리자',
            status: '활성',
            signupDate: '2023-12-08',
          },
          {
            name: '최수정',
            email: 'choi@domain.com',
            role: '일반 사용자',
            status: '비활성',
            signupDate: '2023-11-30',
          },
        ].some((item) => item.status === '비활성') && (
          <Toast
            variant="warning"
            message="비활성 사용자가 포함되어 있습니다"
            onClose={() => {}}
          />
        )}

        <DataTable
          pagination={{
            pageSize: 4,
          }}
          selectable
          columns={[
            { key: 'name', label: '이름' },
            { key: 'email', label: '이메일' },
            { key: 'role', label: '역할' },
            { key: 'status', label: '상태' },
            { key: 'signupDate', label: '가입일' },
          ]}
          data={[
            {
              name: '홍길동',
              email: 'hong@domain.com',
              role: '관리자',
              status: '활성',
              signupDate: '2024-05-01',
            },
            {
              name: '김철수',
              email: 'kim@domain.com',
              role: '일반 사용자',
              status: '비활성',
              signupDate: '2024-03-15',
            },
            {
              name: '이영희',
              email: 'lee@domain.com',
              role: '에디터',
              status: '활성',
              signupDate: '2024-01-22',
            },
            {
              name: '박민수',
              email: 'park@domain.com',
              role: '관리자',
              status: '활성',
              signupDate: '2023-12-08',
            },
            {
              name: '최수정',
              email: 'choi@domain.com',
              role: '일반 사용자',
              status: '비활성',
              signupDate: '2023-11-30',
            },
          ]}
        />
      </div>
    </>
  )
}

export default App
