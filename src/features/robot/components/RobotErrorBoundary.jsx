'use client';
import { Component } from 'react';

export default class RobotErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.warn('Robot 3D unavailable:', error); this.props.onError?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}
