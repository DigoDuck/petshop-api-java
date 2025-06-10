import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="page-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className="page-title">Erro 404</h1>
            <h2>Página Não Encontrada</h2>
            <p>A página que você está procurando não existe ou foi movida.</p>
            <Link to="/" className="btn btn-primary">
                Voltar para a Página Inicial
            </Link>
        </div>
    );
};

export default NotFoundPage;