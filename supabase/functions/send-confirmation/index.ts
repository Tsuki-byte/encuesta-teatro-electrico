import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Gran Espectáculo Eléctrico <onboarding@resend.dev>', // Cambiar por tu dominio una vez verificado
        to: [email],
        subject: 'Confirmación de Encuesta - Gran Espectáculo Eléctrico',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #F3EDE2; padding: 40px; border-radius: 20px; border: 4px solid #8B2323;">
            <h1 style="color: #8B2323; text-align: center;">¡Gracias por tu participación!</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Has completado con éxito la encuesta de satisfacción del <strong>Gran Espectáculo Eléctrico</strong> (Universidad de Zaragoza).
            </p>
            <div style="background: white; padding: 20px; border-radius: 15px; border-left: 5px solid #D4AF37; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #8B2323;">Participación en el Sorteo:</p>
              <p style="margin: 5px 0 0 0;">Tu correo electrónico ha sido registrado para el sorteo de un <strong>Motor Solar Mendocino</strong>.</p>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
              Este es un mensaje automático. No es necesario responder.
              <br><em>EDEMUZ - Equipo Docente de Electromagnetismo Universidad de Zaragoza</em>
            </p>
            <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
              <a href="https://tsuki-byte.github.io/encuesta-teatro-electrico/unsubscribe.html?email=${email}" style="font-size: 12px; color: #999; text-decoration: underline;">Darse de baja de comunicaciones publicitarias</a>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
