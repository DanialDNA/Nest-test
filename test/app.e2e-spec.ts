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
        // this dto is used in signin route too, no problem with it
        const dto: signupDto =  {
            email: "danialdvdvd@gmail.com",
            password: "1234",
            username: "danial"
        }
        describe('sign up', () => {
            it("should throw error when email is empty", () => {
                return pactum.spec().post('/auth/signup').withBody({password: dto.password}).expectStatus(400)

            })
            it("should throw error when password is empty", () => {
                return pactum.spec().post('/auth/signup').withBody({email: dto.email}).expectStatus(400)

            })

            it("should throw error when username is empty", () => {
                return pactum.spec().post('/auth/signup').withBody({email: dto.email, password: dto.password}).expectStatus(400)

            })

            it("should throw error when data is empty", () => {
                return pactum.spec().post('/auth/signup').withBody({}).expectStatus(400)

            })

            it("should signup", () => {
                return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201).stores('userId', 'id')
                
            })
            
        })
        describe('sign in', () => {
            it("should throw error when email is empty", () => {
                return pactum.spec().post('/auth/signin').withBody({password: dto.password}).expectStatus(400)

            })
            it("should throw error when password is empty", () => {
                return pactum.spec().post('/auth/signin').withBody({email: dto.email}).expectStatus(400)

            })

            it("should throw error when data is empty", () => {
                return pactum.spec().post('/auth/signin').withBody({}).expectStatus(400)

            })

            it("should signin", () => {
                return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'jwtToken')

            })

        })

    })
    describe('User', () => {
        describe('Get user by id', () => {
            it('should get user by id', () => {
                return pactum.spec().get("/user/$S{userId}").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(200)
            })
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