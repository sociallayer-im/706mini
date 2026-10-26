
`grow=true`用于flex动作栏的主CTA：原生button为flex:1，内部control-face必须width:100%且flex:1，让背景与触控区同步延伸到动作栏内右padding。次要按钮保持内容宽。普通内联按钮不传grow；单独整行使用block。长文字可换行，disabled/loading保留相同宽度。
