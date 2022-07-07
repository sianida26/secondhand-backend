import request from 'supertest';

import app from '../../app';
import ProductFactory from '../../models/factories/ProductFactory';
import UserFactory from '../../models/factories/UserFactory';
import { Bids } from '../../models';

describe('Fitur buat tawaran', () => {

    const ENDPOINT_PATH = '/products/delete-product';
    const buyer = null;
    const seller = null;
    const otherSeller = null;
    const product = null;

    beforeAll(async () => {
        buyer = await UserFactory();
        seller = await UserFactory();
        otherSeller = await UserFactory();
        
        product = await ProductFactory(seller);
    });

    afterEach(async () => {
        const bid = await Bids.findOne({ where: { productId: product.id, buyerId: buyer.id } });
        if (bid) await bid.destroy();
    });

    it('Should return 401 if not authenticated', async () => {
        const response = await request(app)
            .post(ENDPOINT_PATH)
            .set('Authorization', buyer.accessToken)
            .send({ id: product.id, bidPrice: 20000});

        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();
    });

    it('Should return 404 if product is not available', async () => {
        const response = await request(app)
            .post(ENDPOINT_PATH)
            .set('Authorization', buyer.accessToken)
            .send({ id: 9999999, bidPrice: 20000});
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBeDefined();
    });

    it('Should return 404 if product is already sold', async () => {
        let bid = null;
        try {
            //make product already sold
            bid = await Bids.create({ buyerId: otherSeller.id, productId: product.id, acceptedAt: new Date(), soldAt: new Date() });

            //send request
            const response = await request(app)
                .post(ENDPOINT_PATH)
                .set('Authorization', buyer.accessToken)
                .send({ id: product.id, bidPrice: 20000});
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBeDefined();
        } catch (error) {
            console.error(error);
        } finally {
            await bid?.destroy();
        }
    });

    it('Should return 403 if attempting to bid his own product', async () => {
        const response = await request(app)
            .post(ENDPOINT_PATH)
            .set('Authorization', seller.accessToken)
            .send({ id: product.id, bidPrice: 20000});
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBeDefined();

        const bidCount = await Bids.findAndCountAll({ where: { productId: product.id, buyerId: seller.id } });
        expect(bidCount).toBe(0);
    });

    it('Should return 200 if success', async () => {
        const response = await request(app)
            .post(ENDPOINT_PATH)
            .set('Authorization', buyer.accessToken)
            .send({ id: product.id, bidPrice: 20000})
        
        expect(response.status, 200);
        
        //Check into database
        const bidCount = await Bids.findAndCountAll({ where: { productId: product.id, buyerId: buyer.id } });
        expect(bidCount).toBe(1);
    });
})