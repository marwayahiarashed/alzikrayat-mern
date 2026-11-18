import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function LoginRegister() {
    return (
        <div className="two-columns">
            <LoginForm />
            <RegisterForm />
        </div>
    );
}

export default LoginRegister;