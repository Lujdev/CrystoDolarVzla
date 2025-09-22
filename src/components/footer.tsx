import { Heart, Linkedin } from 'lucide-react'

/**
 * Componente Footer de CrystoDolar
 * Incluye información específica sobre cotizaciones USDT/Bs y enlaces útiles
 * Adaptado para el contexto del mercado fiat/crypto venezolano
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-16 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información principal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>💎</span>
              <span>CrystoDolar</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma gratuita para consultar cotizaciones de USDT en bolívares venezolanos. 
              Información actualizada de tasas oficiales (BCV) y mercado crypto (Binance P2P) 
              para venezolanos dentro y fuera del país.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h4 className="text-md font-semibold mb-4">Recursos Útiles</h4>
            <ul className="space-y-2 text-sm text-gray-400">

              {/* Historial de Cotizaciones OCULTO TEMPORALMENTE */}
              {/* <li>
                <a 
                  href="#" 
                  className="hover:text-white transition-colors"
                >
                  Historial de Cotizaciones
                </a>
              </li> */}

            </ul>
          </div>

          {/* Información legal y redes */}
          <div>
            <h4 className="text-md font-semibold mb-4">Legal y Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400 mb-4">
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Términos de Uso
                </a>
              </li>
              
            </ul>
            
            {/* Redes sociales */}
            <div className="flex space-x-4">
             
            </div>
          </div>
        </div>

        {/* Copyright y disclaimer */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} CrystoDolar. Todos los derechos reservados.
            </p>
            <p className="text-sm text-gray-400 flex items-center">
              Hecho con <Heart className="h-4 w-4 mx-1 text-red-500" /> para Venezuela
            </p>
          </div>
          
          {/* Disclaimer importante */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-md">
            <p className="text-xs text-blue-200">
              <strong>Disclaimer:</strong> Las cotizaciones USDT/Bs mostradas son referenciales y pueden 
              variar según la fuente. Esta plataforma no realiza operaciones cambiarias ni crypto. 
              Consulta siempre fuentes oficiales para transacciones importantes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
