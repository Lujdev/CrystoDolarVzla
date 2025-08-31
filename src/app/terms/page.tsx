import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText, Scale, Globe, Lock, AlertTriangle, Gavel, RefreshCw, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Términos de Uso - CrystoDolar',
  description: 'Términos y condiciones de uso de la plataforma CrystoDolar para consulta de cotizaciones USDT/Bs.',
  keywords: 'términos de uso, condiciones, CrystoDolar, USDT, bolívares, Venezuela',
}

export default function TermsPage() {
  const sections = [
    {
      id: 1,
      title: "Aceptación de los Términos",
      icon: Shield,
      content: "Al acceder y utilizar el sitio web CrystoDolar (www.crystodolarvzla.site), usted acepta estar sujeto a estos términos de uso y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, se le prohíbe usar o acceder a este sitio."
    },
    {
      id: 2,
      title: "Propósito del Sitio",
      icon: FileText,
      content: "CrystoDolar es una plataforma informativa que proporciona cotizaciones de referencia de USDT en bolívares venezolanos. La información presentada es únicamente para fines informativos y no constituye asesoramiento financiero o de inversión."
    },
    {
      id: 3,
      title: "Descargo de Responsabilidad",
      icon: AlertTriangle,
      content: "Las cotizaciones mostradas en CrystoDolar son referenciales y pueden variar según la fuente y el momento de consulta. No garantizamos la exactitud, completitud o actualidad de la información proporcionada. Los usuarios deben verificar independientemente cualquier información antes de tomar decisiones financieras."
    },
    {
      id: 4,
      title: "Uso Personal",
      icon: Lock,
      content: "Este sitio web es para uso personal y no comercial. No está permitido reproducir, duplicar, copiar, vender, revender o explotar cualquier parte del servicio sin nuestro consentimiento expreso por escrito."
    },
    {
      id: 5,
      title: "Recopilación de Datos",
      icon: Shield,
      content: "CrystoDolar puede recopilar información de uso anónima para mejorar el servicio. No recopilamos información personal identificable sin el consentimiento explícito del usuario. Respetamos la privacidad de nuestros usuarios y cumplimos con las regulaciones aplicables de protección de datos."
    },
    {
      id: 6,
      title: "Propiedad Intelectual",
      icon: FileText,
      content: "Todo el contenido de este sitio web, incluyendo pero no limitado a texto, gráficos, logotipos, iconos, imágenes y software, es propiedad de CrystoDolar o sus proveedores de contenido y está protegido por las leyes de derechos de autor venezolanas e internacionales."
    },
    {
      id: 7,
      title: "Enlaces Externos",
      icon: Globe,
      content: "CrystoDolar puede contener enlaces a sitios web de terceros. No tenemos control sobre el contenido, políticas de privacidad o prácticas de estos sitios externos y no asumimos responsabilidad por ellos. Le recomendamos revisar los términos y políticas de cualquier sitio web de terceros que visite."
    },
    {
      id: 8,
      title: "Limitación de Responsabilidad",
      icon: AlertTriangle,
      content: "En ningún caso CrystoDolar o sus proveedores serán responsables por daños especiales, incidentales, indirectos o consecuentes que resulten del uso o la imposibilidad de usar el sitio web, incluso si CrystoDolar ha sido notificado de la posibilidad de tales daños."
    },
    {
      id: 9,
      title: "Jurisdicción",
      icon: Gavel,
      content: "Estos términos de uso se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales venezolanos."
    },
    {
      id: 10,
      title: "Modificaciones",
      icon: RefreshCw,
      content: "CrystoDolar se reserva el derecho de revisar estos términos de uso en cualquier momento sin previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos términos de uso."
    }
  ]

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Header elegante */}
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <Image 
                src="https://cdn.crystodolarvzla.site/crysto.png" 
                alt="CrystoDolar Logo" 
                width={40} 
                height={40} 
                className="rounded-lg" 
                priority 
              />
              <div>
                <h1 className="text-xl font-bold text-white">CrystoDolar</h1>
                <p className="text-sm text-gray-300">Términos de Uso</p>
              </div>
            </div>
            
            {/* Botón de regreso */}
            <Button
              asChild
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
            >
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Volver al Inicio</span>
                <span className="sm:hidden">Inicio</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
            <Scale className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Términos de Uso
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Conoce los términos y condiciones que rigen el uso de nuestra plataforma de cotizaciones
          </p>
        </div>

        {/* Disclaimer destacado */}
        <div className="mb-12">
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  Información Importante
                </h3>
                <p className="text-blue-200 leading-relaxed">
                  Las cotizaciones USDT/Bs mostradas son referenciales y pueden variar según la fuente. 
                  Esta plataforma no realiza operaciones cambiarias ni crypto. Consulta siempre fuentes 
                  oficiales para transacciones importantes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones de términos */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {sections.map((section) => {
            const IconComponent = section.icon
            return (
              <div 
                key={section.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3">
                      {section.id}. {section.title}
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer de la página */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400 mb-4">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Última actualización: {new Date().toLocaleDateString('es-VE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  )
}