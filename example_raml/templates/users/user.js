var created = faker.date.past(),
    birth = faker.date.between(1920, 2000);

birth = birth.toISOString().slice(0, 10);

module.exports = {
    id: tmplUtils.stringId(),
    birthDate: birth,
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    gender: faker.random.array_element(['male', 'female']),
    status: faker.random.array_element([true, false]),
    createdAt: created,
    updatedAt: created,
    idArray: tmplUtils.multiCollection(0, 20)(function (i) {
        return tmplUtils.stringId();
    }),
    points: faker.helpers.randomNumber({min: 1, max: 100})
}