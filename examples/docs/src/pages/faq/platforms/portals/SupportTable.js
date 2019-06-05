import React from 'react'
import styled from 'styled-components'
import supportTable from '../../../../assets/platform_support.png'

const StyledImg = styled.img`
  display: block;
  width: 100%;
  max-width: 550px !important;
  margin: 20px auto;
`

export default () => <StyledImg src={supportTable} alt='platform support' />
