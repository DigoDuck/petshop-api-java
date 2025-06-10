package petshop.test;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import petshop.PetshopApiApplication; // Importe a classe principal

@SpringBootTest(classes = PetshopApiApplication.class) // <--- Especifique a classe aqui!
class PetshopApiApplicationTests {

	@Test
	void contextLoads() {
	}
}