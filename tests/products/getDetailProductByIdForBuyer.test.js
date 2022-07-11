const request = require('supertest');
const { Op } = require('sequelize');

const app = require('../../app');
const ProductFactory = require('../../models/factories/ProductFactory');
const UserFactory = require('../../models/factories/UserFactory');
const { Bids } = require('../../models');

describe("Get Detail Product By Id For Buyer", () => {

    const ENDPOINT_PATH = '/products/detail-buyer';
    let buyer = null;
    let seller = null;
    let product = null;
    let bid = null;

    beforeAll(async () => {
        buyer = await UserFactory();
        seller = await UserFactory();
        
        product = await ProductFactory(seller);
    });

    afterEach(async () => {
        await Bids.destroy({ where: { productId: product.id } });
    });

    afterAll(async () => {
        await bid.destroy();
        await product.destroy();
        await buyer.destroy();
        await seller.destroy();
    })

    it("Should return 404 if product does not exists", async () => {
        const response = await request(app)
            .post(ENDPOINT_PATH + '/99999')
            .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBeDefined();
    }); 

    it("Should return 403 if requesting his own product", async () => {
        const response = await request(app)
            .post(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', `Bearer ${ seller.accessToken }`)
            .send();

        expect(response.status).toBe(403);
        expect(response.body.message).toBeDefined();
    });

    it("Should return status \"BIDDABLE\" if product is available", async () => {
        const response = await request(app)
            .post(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', `Bearer ${ buyer.accessToken }`)
            .send();
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("BIDDABLE");
    });

    it("Should return status \"BIDDABLE\" if not logged in", async () => {
        const response = await request(app)
            .post(`${ ENDPOINT_PATH }/${ product.id }`)
            .send();
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("BIDDABLE");
    });

    it("Should return status \"WAITING_CONFIRMATION\" if bid already sent", async () => {
        await Bids.create({
            buyerId: buyer.id,
            productId: product.id,
            bidPrice: Math.random()*product.price,
        });

        const response = await request(app)
            .post(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', `Bearer ${ buyer.accessToken }`)
            .send();
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("WAITING_CONFIRMATION");
    });

    it("Should return \"TRANSACTION_DECLINED\" if the transaction was declined", async () => {
        await Bids.create({
            buyerId: buyer.id,
            productId: product.id,
            bidPrice: Math.random()*product.price,
            declinedAt: new Date(),
        });

        const response = await request(app)
            .post(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', `Bearer ${ buyer.accessToken }`)
            .send();
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("TRANSACTION_DECLINED");
    });

    it("Should return \"TRANSACTION_COMPLETED\" if transaction completed", async () => {
        await Bids.create({
            buyerId: buyer.id,
            productId: product.id,
            bidPrice: Math.random()*product.price,
            soldAt: new Date()
        });

        const response = await request(app)
            .post(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', `Bearer ${ buyer.accessToken }`)
            .send();
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("TRANSACTION_COMPLETED");
    });

    it("Should return 404 if product already been accepted", async () => {
        await Bids.create({
            buyerId: buyer.id,
            productId: product.id,
            bidPrice: Math.random()*product.price,
            acceptedAt: new Date(),
        });

        const response = await request(app)
            .post(`${ ENDPOINT_PATH }/${ product.id }`)
            .send();
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBeDefined();
    });
})