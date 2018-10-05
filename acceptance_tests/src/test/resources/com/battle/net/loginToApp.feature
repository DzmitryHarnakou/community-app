@API
Feature: Login to application as test user

  Scenario: User can login to BattleNet
    Given User register to app first time
      | email             | password | name     | language |
      | testemail@mail.ru | 123456   | testuser | en       |
    When User login to App
    Then Check user is logged in successfully