import React from 'react'
import { view, store, route, Link } from 'react-stax'
import userStore from '../../stores/user'

export default view(() => {
  const state = store({
    user: {
      email: '',
      username: '',
      password: ''
    },
    errors: []
  })

  const onChange = ev => {
    state.user[ev.target.name] = ev.target.value
  }

  const onSubmit = async ev => {
    ev.preventDefault()
    try {
      await userStore.register(state.user)
      route({ to: '/home' })
    } catch (err) {
      const errors = err.response.data.errors
      state.errors = []
      for (const key in errors) {
        const error = errors[key]
        state.errors.push(`${key} ${error.join(' and ')}`)
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>
            <ul className="error-messages">
              {state.errors.map(error => (
                <li key={error}>{error}</li>
              ))}
            </ul>
            <form onChange={onChange} onSubmit={onSubmit}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="username"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
})
