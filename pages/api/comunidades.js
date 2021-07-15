import { SiteClient } from 'datocms-client';


export default async function recebedorDeRequests(request, response) {
    
    if (request.method === 'POST') {
        const TOKEN = '9ac4284e86232a75885fb7a0e8df23';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "972248",
            ...request.body
        });
    
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado
        })

        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}