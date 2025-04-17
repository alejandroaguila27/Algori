import { AfterViewInit, Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.setupMobileMenu();
    this.setupContactForm();
  }

  private setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (menuToggle && sidebar && overlay) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-left-24');
        sidebar.classList.toggle('left-0');
        overlay.classList.toggle('hidden');
      });
      
      overlay.addEventListener('click', () => {
        sidebar.classList.add('-left-24');
        sidebar.classList.remove('left-0');
        overlay.classList.add('hidden');
      });
    }
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      // Cerrar el menú en móvil si está abierto
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('overlay');
      if (sidebar && overlay) {
        sidebar.classList.add('-left-24');
        sidebar.classList.remove('left-0');
        overlay.classList.add('hidden');
      }

      // Scroll suave a la sección
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private setupContactForm() {
    const form = document.getElementById('contactForm') as HTMLFormElement;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Mostrar spinner
      const submitText = document.getElementById('submitText');
      const submitSpinner = document.getElementById('submitSpinner');
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      
      if (submitText) {
        submitText.textContent = 'Enviando...';
      }
      if (submitSpinner) {
        submitSpinner.classList.remove('hidden');
      }
      submitButton.disabled = true;
      
      // Mostrar alerta de carga
      Swal.fire({
        title: 'Enviando mensaje',
        html: 'Por favor espera un momento...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      try {
        const formData = new FormData(form);
        
        // Enviar datos a FormSubmit
        const response = await fetch('https://formsubmit.co/ajax/alejandro.aguila.dev@gmail.com', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Mostrar alerta de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Mensaje enviado!',
            text: 'Te responderemos lo antes posible',
            confirmButtonColor: '#0d9488', // Color teal-600
          });
          
          // Limpiar formulario
          form.reset();
        } else {
          throw new Error(result.message || 'Error al enviar el mensaje');
        }
      } catch (error) {
        // Mostrar alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp.',
          confirmButtonColor: '#0d9488',
        });
      } finally {
        // Restaurar botón
        if (submitText) {
          submitText.textContent = 'Enviar Mensaje';
        }
        if (submitSpinner) {
          submitSpinner.classList.add('hidden');
        }
        submitButton.disabled = false;
      }
    });
  }
}
