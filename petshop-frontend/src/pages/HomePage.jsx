import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="container col-xxl-8 px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-10 col-sm-8 col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2070"
            className="d-block mx-lg-auto img-fluid rounded shadow"
            alt="Cachorro feliz"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
            Bem-vindo(a) ao Petshop Angels!
          </h1>
          <p className="lead">
            Tudo o que seu melhor amigo precisa em um só lugar. Explore nossos
            produtos de alta qualidade e agende serviços com os melhores
            profissionais.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <Link
              to="/produtos"
              className="btn btn-primary btn-lg px-4 me-md-2"
            >
              Ver Produtos
            </Link>
            <Link
              to="/meus-agendamentos"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Meus Agendamentos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
