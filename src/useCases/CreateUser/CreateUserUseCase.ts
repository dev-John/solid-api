import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

// the UseCase cares only for the implementation of the logic, the business rule, not tech details
// this class has only 1 responsability, following the Single Responsability Principle fo the SOLID
export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository, // using private in the constructor auto instances the property instead of doing this outside the constructor
    private mailProvider: IMailProvider
  ) {}

  async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User Already Exists');
    }

    const user = new User(data);

    await this.usersRepository.save(user);

    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email
      },
      from: {
        name: 'My app team',
        email: 'team@myapp.com'
      },
      subject: 'Welcome to the platform',
      body: '<p>You can login on our app</p>'
    })
  }
}