import React from "react";
import enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Link } from "react-easy-stack";
import App from "./App";

enzyme.configure({ adapter: new Adapter() });

describe("TodoMVC App", () => {
  const app = mount(<App />);

  test("should add todos", () => {
    // expect(app).toMatchSnapshot('01. Initial state')

    const input = app.find(".new-todo");

    input.simulate("keyUp", {
      keyCode: 13,
      target: { value: "Test Todo" }
    });
    // expect(app).toMatchSnapshot('02. Add Test Todo')

    input.simulate("keyUp", {
      keyCode: 13,
      target: { value: "Other Todo" }
    });
    // expect(app).toMatchSnapshot('03. Add Other Todo')

    input.simulate("keyUp", {
      keyCode: 27,
      target: { value: "Final Tod" }
    });
    input.simulate("keyUp", {
      keyCode: 13,
      target: { value: "Final Todo" }
    });
    // expect(app).toMatchSnapshot('04. Add Final Todo')
  });

  test("should toggle todo status", () => {
    const toggles = app.find(".todo-list .toggle");

    toggles.at(0).simulate("change");
    // expect(app).toMatchSnapshot('05. Toggle Test Todo to completed')

    toggles.at(1).simulate("change");
    // expect(app).toMatchSnapshot('06. Toggle Other Todo to completed')

    toggles.at(0).simulate("change");
    // expect(app).toMatchSnapshot('07. Toggle Test Todo to active')
  });

  test("should filter todos", () => {
    const allFilter = app.find(Link).at(0);
    const activeFilter = app.find(Link).at(1);
    const completedFilter = app.find(Link).at(2);

    completedFilter.simulate("click");
    // expect(app).toMatchSnapshot('08. Filter completed')

    activeFilter.simulate("click");
    // expect(app).toMatchSnapshot('09. Filter active')

    allFilter.simulate("click");
    // expect(app).toMatchSnapshot('10. Filter all')
  });

  test("should clear completed", () => {
    const clearCompleted = app.find(".clear-completed");

    clearCompleted.simulate("click");
    // expect(app).toMatchSnapshot('11. Clear completed')
  });

  test("should toggle all todo state at once", () => {
    const toggleAll = app.find(".toggle-all");

    toggleAll.simulate("change");
    // expect(app).toMatchSnapshot('12. Toggle all to completed')

    toggleAll.simulate("change");
    // expect(app).toMatchSnapshot('13. Toggle all to active')
  });

  test("should delete todo", () => {
    const deleters = app.find(".todo-list .destroy");

    deleters.at(0).simulate("click");
    // expect(app).toMatchSnapshot('14. Delete Test Todo')
  });
});
