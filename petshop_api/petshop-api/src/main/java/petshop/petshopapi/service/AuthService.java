package petshop.petshopapi.service;

import petshop.petshopapi.dto.LoginRequest;
import petshop.petshopapi.dto.LoginResponse;
import petshop.petshopapi.entity.TipoUsuario;
import petshop.petshopapi.entity.Usuario;
import petshop.petshopapi.repository.UsuarioRepository;
import petshop.petshopapi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService; // Para carregar UserDetails após autenticação

    @Autowired
    private JwtUtil jwtUtil; // Para gerar o JWT

    public Usuario registrarUsuario(Usuario usuario) {
        // Verifica se o email já está em uso
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Email já registrado.");
        }
        // Define o tipo de usuário padrão (ex: CLIENTE), se não for explicitamente definido
        if (usuario.getTipo() == null) {
            usuario.setTipo(TipoUsuario.CLIENTE);
        }
        // Codifica a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        // Tenta autenticar o usuário com as credenciais
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha())
        );

        // Se a autenticação foi bem-sucedida, carrega os detalhes do usuário
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());

        // Gera o token JWT
        final String jwt = jwtUtil.generateToken(userDetails);

        // Retorna a resposta de login com o token
        return new LoginResponse(jwt);
    }
}