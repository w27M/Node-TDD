import request from 'supertest';
import app from "../../main/config/app";

describe('Content-type middleware', () => {

    it('should return content-type default as Json', async () => {
        app.get('/test_content-type', (req, res) => {
            res.send('');
        });
        await request(app)
            .get('/test_content-type')
            .expect('content-type', /json/)
    });

    it('should return xml content type when forced', async () => {
        app.get('/test_content-type-xml', (req, res) => {
            res.type('text/xml');
            res.send('');
        });
        await request(app)
            .get('/test_content-type-xml')
            .expect('content-type', /xml/)
    });
});

