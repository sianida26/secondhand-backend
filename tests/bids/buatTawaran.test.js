const request = require('supertest');
const { Op } = require('sequelize');

const app = require('../../app');
const ProductFactory = require('../../models/factories/ProductFactory');
const UserFactory = require('../../models/factories/UserFactory');
const { Bids } = require('../../models');

describe('Fitur buat tawaran', () => {

    const ENDPOINT_PATH = '/products/delete-product';
    let buyer = null;
    let seller = null;
    let otherBuyer = null;
    let product = null;

    beforeAll(async () => {
        buyer = await UserFactory();
        seller = await UserFactory();
        otherBuyer = await UserFactory();
        
        product = await ProductFactory(seller);
    });

    afterEach(async () => {
        const bid = await Bids.findOne({ where: { productId: product.id, buyerId: { [Op.or]: [buyer.id, otherBuyer.id] } } });
        await bid?.destroy?.();
    });

    afterAll(async () => {
        await product.destroy();
        await buyer.destroy();
        await seller.destroy();
        await otherBuyer.destroy();
    })

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

        //Make product already sold
        await Bids.create({ buyerId: otherBuyer.id, productId: product.id, bidPrice: Math.floor(Math.random()*100000), acceptedAt: new Date(), soldAt: new Date() });

        //send request
        const response = await request(app)
            .post(ENDPOINT_PATH)
            .set('Authorization', buyer.accessToken)
            .send({ id: product.id, bidPrice: 20000});
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBeDefined();
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
        
        expect(response.status).toBe(200);
        
        //Check into database
        const bidCount = await Bids.findAndCountAll({ where: { productId: product.id, buyerId: buyer.id } });
        expect(bidCount).toBe(1);
    });
})