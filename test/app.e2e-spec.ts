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
                return pactum.spec().get("/users/$S{userId}").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(200)
            })
        })

        describe('Edit user', () => {            
            it('should throw error when fields is empty', () => {
                return pactum.spec().patch("/users").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "id": "$S{userId}",
                    "fields": {}
                }).expectStatus(400)
            })
            
            
            it("should throw error when id is not sent", () => {
                return pactum.spec().patch("/users").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "fields": {"firstName": "test"}
                }).expectStatus(400)

            })
        
            it("should edit user", () => {
                return pactum.spec().patch("/users").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "id": "$S{userId}",
                    "fields": {"title": "test"}
                }).expectStatus(200)
            })
        
        })

    })

    describe('Bookmark', () => {
        describe('Get empty bookmarks', () => {
            it("should get empty bookmark", () => {
                return pactum.spec().get("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(200)
                .expectBody({"success": true, "bookmarks": []})
            })
        })
        
        
        describe('Create bookmark', () => {
            it("should throw error when title is not sent", () => {
                return pactum.spec().post("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "link": "testy link"
                }).expectStatus(400)
            })

            it("should throw error when link is not sent", () => {
                return pactum.spec().post("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "title": "testy title"
                }).expectStatus(400)
            })

            it("should create bookmark", () => {
                return pactum.spec().post("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "title": "testy title",
                    "link": "testy link"
                }).expectStatus(201).stores('bookmarkId', 'newBookmark.id')
            })
        })

        describe('Get bookmarks', () => {
            it("should get bookmark list", () => {
                return pactum.spec().get("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(200)
                .expectJsonLength("bookmarks", 1)
            })

        })

        describe('Get bookmarks by id', () => {})
            it('should throw error when bookmark does not exist', () => {
                return pactum.spec().get("/bookmarks/0").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(404)
            })
        
            it("should get specific bookmark", () => {
                return pactum.spec().get("/bookmarks/$S{bookmarkId}").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(200)
            })

        describe('Edit bookmark by id', () => {
            it('should throw error when bookmark does not exist', () => {
                return pactum.spec().patch("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "id": 0,
                    "fields": {"title": "test"} 
                }).expectStatus(404)
            })

            it('should throw error when fields is empty', () => {
                return pactum.spec().patch("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "id": "$S{bookmarkId}",
                    "fields": {} 
                }).expectStatus(400)
            })

            it('should update bookmark', () => {
                return pactum.spec().patch("/bookmarks").withHeaders({Authorization: "bearer $S{userAt}"}).withBody({
                    "id": "$S{bookmarkId}",
                    "fields": {"title": "test"} 
                }).expectStatus(200)
            })
        })

        describe('Delete bookmark by id ', () => {
            it("should throw error when bookmark does not exist", () => {
                return pactum.spec().delete("/bookmarks/0").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(404)

            })
                        
            it('should delete bookmark', () => {
                return pactum.spec().delete("/bookmarks/$S{bookmarkId}").withHeaders({Authorization: "bearer $S{userAt}"}).expectStatus(200)
            })

        })

    })

});