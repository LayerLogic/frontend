import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import GreetingMsg from '../landing/GreetingMsg.vue'

describe('GreetingMsg', () => {
  it('renders properly', () => {
    const wrapper = mount(GreetingMsg, { props: { msg: 'LayerLogic' } })
    expect(wrapper.text()).toContain('LayerLogic')
  })
})
