const createController = require("../src/controller");

describe.only("Get users", () => {
  let baseUrl, timeout, payload1, payload2, payload3;
  beforeEach(() => {
    baseUrl = "https://api.github.com";
    timeout = 20000;

    payload1 = {
      body: JSON.stringify({
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            login: "Babanila",
            id: 23488237,
            node_id: "MDQ6VXNlcjIzNDg4MjM3",
            avatar_url: "https://avatars2.githubusercontent.com/u/23488237?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/Babanila",
            html_url: "https://github.com/Babanila",
            followers_url: "https://api.github.com/users/Babanila/followers",
            following_url:
              "https://api.github.com/users/Babanila/following{/other_user}",
            gists_url: "https://api.github.com/users/Babanila/gists{/gist_id}",
            starred_url:
              "https://api.github.com/users/Babanila/starred{/owner}{/repo}",
            subscriptions_url:
              "https://api.github.com/users/Babanila/subscriptions",
            organizations_url: "https://api.github.com/users/Babanila/orgs",
            repos_url: "https://api.github.com/users/Babanila/repos",
            events_url:
              "https://api.github.com/users/Babanila/events{/privacy}",
            received_events_url:
              "https://api.github.com/users/Babanila/received_events",
            type: "User",
            site_admin: false,
            score: 1,
          },
        ],
      }),
    };

    payload2 = {
      body: JSON.stringify({
        login: "Babanila",
        id: 23488237,
        name: "Babajide Williams",
        avatar_url: "https://avatars2.githubusercontent.com/u/23488237?v=4",
        followers: 1,
      }),
    };

    payload3 = [
      {
        name: "Babajide Williams",
        followers: 1,
        avatar_url: "https://avatars2.githubusercontent.com/u/23488237?v=4",
        username: "Babanila",
      },
    ];
  });

  describe("Handle multiple languages", () => {
    it("should call fetcher once with search endpoint response with data", async () => {
      const mockedGot = jest.fn().mockResolvedValueOnce(payload1);
      formatLanguages = jest.fn().mockReturnValue([`language:"javascript"`]);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );

      const res = {
        end: function () {},
        status: function () {
          this.statusCode = 200;
          return this;
        },
        send: () => payload1.body,
      };
      const req = { query: { username: "Babanila", language: "javascript" } };
      const results = await getUsers(req, res);

      expect(results).toBeDefined();
      expect(mockedGot).toHaveBeenCalled();
      expect(
        mockedGot
      ).toHaveBeenCalledWith(
        `${baseUrl}/search/users?q=Babanila+in:login+language:\"javascript\"`,
        { timeout: 20000 }
      );
      expect(results).toBe(payload1.body);
    });

    it("should call fetcher for fallback languages on timeout", async () => {
      const payload = {
        status: 403,
        name: "TimeoutError",
        msg: "Timeout",
      };
      const timeout = 10;
      const mockedGot = jest.fn().mockRejectedValue(payload);
      formatLanguages = jest.fn().mockReturnValue([`language:"javascript"`]);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );
      const res = {
        end: function () {},
        status: function () {
          this.statusCode = 403;
          return this;
        },
        send: () => "Timeout",
      };
      const req = { query: { username: "Babanila", language: "javascript" } };
      const results = await getUsers(req, res);
      expect(results).toBeDefined();
      expect(results).toBe(payload.msg);
    });

    it("should handle when no language is available on the users", async () => {
      const payload = {
        status: 200,
        msg: `No Github user with the programming language java`,
      };
      const mockedGot = jest.fn().mockResolvedValueOnce(payload);
      formatLanguages = jest.fn().mockReturnValue([`language:"java"`]);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );
      const res = {
        end: function () {},
        status: function () {
          this.statusCode = 200;
          return this;
        },
        send: () => `No Github user with the programming language java`,
      };
      const req = { query: { username: "Babanila", language: "java" } };
      const results = await getUsers(req, res);
      expect(results).toBeDefined();
      expect(results).toBe(payload.msg);
    });

    it("should call fetcher for fallback languages on empty response", async () => {
      const mockedGot = jest
        .fn()
        .mockResolvedValueOnce(payload1)
        .mockResolvedValueOnce(payload2);
      formatLanguages = jest
        .fn()
        .mockReturnValue([`language:"java"`, `language:"javascript"`]);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );
      const res = {
        end: function () {},
        status: function () {
          this.statusCode = 200;
          return this;
        },
        send: () => payload3,
      };
      const req = {
        query: { username: "Babanila", language: "java, javascript" },
      };
      const results = await getUsers(req, res);
      expect(results).toBeDefined();
      expect(results).toEqual(payload3);
      expect(results[0].username).toEqual("Babanila");
      expect(results[0].name).toEqual("Babajide Williams");
      expect(results[0].followers).toEqual(1);
    });

    it("should handle no language in request", async () => {
      const payload = `Please add value for the language parameter in the query. E.g ../get-users?username=john&language=java`;
      const mockedGot = jest.fn().mockResolvedValue(payload);
      formatLanguages = jest.fn().mockReturnValue([]);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );
      const res = {
        end: function () {},
        status: function () {
          this.statusCode = 200;
          return this;
        },
        send: () =>
          `Please add value for the language parameter in the query. E.g ../get-users?username=john&language=java`,
      };
      const req = { query: { username: "Babanila" } };
      const results = await getUsers(req, res);
      expect(results).toBeDefined();
      expect(results).toEqual(payload);
    });

    it("should handle no response for all languages", async () => {
      const payload = `Please reduce the number of programming languages parameter in the query, maximum of 5 is allowed.`;
      const mockedGot = jest.fn().mockResolvedValue(payload);
      formatLanguages = jest
        .fn()
        .mockReturnValue([
          `language:"php"`,
          `language:"python"`,
          `language:"go"`,
          `language:"java"`,
          `language:"javascript"`,
          `language:"c#"`,
          `language:"c++"`,
          `language:"coffeescript"`,
        ]);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );
      const res = {
        end: function () {},
        status: function () {
          this.statusCode = 500;
          return this;
        },
        send: () =>
          `Please reduce the number of programming languages parameter in the query, maximum of 5 is allowed.`,
      };
      const req = {
        query: {
          username: "Babanila",
          language: "php,python,go,java,javascript,c#,c++,coffeescript",
        },
      };
      const results = await getUsers(req, res);
      expect(results).toBeDefined();
      expect(results).toEqual(payload);
    });
  });

  describe("Gets data", () => {
    let formatLanguages;
    beforeEach(() => {
      formatLanguages = jest.fn().mockReturnValue([`language:"javascript"`]);
    });
    it("should return valid object for found user", async () => {
      const mockedGot = jest
        .fn()
        .mockResolvedValueOnce(payload1)
        .mockResolvedValueOnce(payload2);

      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );

      const res = {
        status: function () {
          this.statusCode = 200;
          return this;
        },
        send: () => payload3,
        end: function () {},
      };
      const req = { query: { username: "Babanila", language: "javascript" } };
      const results = await getUsers(req, res);

      expect(results).toBeDefined();
      expect(mockedGot).toHaveBeenCalled();
      expect(
        mockedGot
      ).toHaveBeenCalledWith(
        `${baseUrl}/search/users?q=Babanila+in:login+language:\"javascript\"`,
        { timeout: 20000 }
      );
      expect(mockedGot).toHaveBeenCalledWith(`${baseUrl}/users/Babanila`, {
        timeout: 20000,
      });
      expect(results).toEqual(payload3);
      expect(results[0].username).toEqual("Babanila");
      expect(results[0].name).toEqual("Babajide Williams");
      expect(results[0].followers).toEqual(1);
      expect(results[0].avatar_url).toEqual(
        "https://avatars2.githubusercontent.com/u/23488237?v=4"
      );
    });

    it("should return 4xx error on client issues", async () => {
      const payload = {
        status: 403,
        name: "HTTPError",
        msg: "Rate Limit Exceeded, Try Again later",
      };
      const mockedGot = jest.fn().mockRejectedValue(payload);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );

      const res = {
        status: function () {
          this.statusCode = 400;
          return this;
        },
        send: () => "Rate Limit Exceeded, Try Again later",
        end: function () {},
      };

      const req = { query: { username: "Babanila", language: "javascript" } };
      const results = await getUsers(req, res);
      expect(results).toBeDefined();
      expect(results).toEqual(payload.msg);
    });

    it("should return 5xx error on server error", async () => {
      const payload = {
        status: 500,
        name: "HTTPError",
        msg: "Internal Server Error",
      };
      const mockedGot = jest.fn().mockRejectedValue(payload);
      const { getUsers } = createController(
        mockedGot,
        formatLanguages,
        baseUrl,
        timeout
      );

      const res = {
        status: function () {
          this.statusCode = 500;
          return this;
        },
        send: () => "Internal Server Error",
        end: function () {},
      };

      const req = { query: { username: "Babanila", language: "javascript" } };
      const results = await getUsers(req, res);
      expect(results).toBeDefined();
      expect(results).toEqual(payload.msg);
    });
  });
});
