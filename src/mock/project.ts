import { faker } from '@faker-js/faker'

interface Project {
  id: string
  name: string
  director: string
  time: Date
  status: '1' | '2' | '3'
}

const generateProjectList = (count: number): Project[] => {
  const projectList: Project[] = []
  const status = ['1', '2', '3'] as const
  for (let i = 0; i < count; i++) {
    projectList.push({
      id: faker.database.mongodbObjectId(),
      name: faker.company.name(),
      director: faker.person.fullName(),
      time: faker.date.anytime(),
      status: status[Math.floor(Math.random() * 3)]
    })
  }
  return projectList
}

export default generateProjectList