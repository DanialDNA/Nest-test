import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum"
import { signupDto } from "src/auth/dto";


describe ("App e2e", () => {
    let prisma: PrismaService;
    let app: INestApplication;
    
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
            whitelist: true,
            }),
        );

        await app.init();
        await app.listen(3333);
        pactum.request.setBaseUrl("http://localhost:3333")

        prisma = app.get(PrismaService)
        await prisma.cleanDb();        
    })
    afterAll(() => {
        app.close();
    });

    describe("Auth", () => {
        describe('sign up', () => {
            it("should signup", () => {
                const dto: signupDto=  {
                    email: "danialdvdvd@gmail.com",
                    password: "1234",
                    username: "danial"
                }
                return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)

            })

        })
        describe('sign in', () => {


        })

    })
    describe('User', () => {
        describe('Get user by id', () => {

        })

        describe('Edit user', () => {

        })

    })

    describe('Bookmark', () => {
        describe('Create bookmark', () => {

        })

        describe('Edit bookmark', () => {



        })

    })

});