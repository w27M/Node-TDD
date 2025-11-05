import request from 'supertest';
import app from "../../main/config/app";

describe('Cors middleware', () => {

    it('should enable CORS', async () => {
        app.get('/test_cors', (req, res) => {
            res.send();
        });
        await request(app)
            .get('/test_body_parser')
            .expect('access-control-allow-origin', '*')
            .expect('Access-Control-Allow-method', '*')
            .expect('Access-Control-Allow-headers', '*');
    });
});

