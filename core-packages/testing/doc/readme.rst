=========================================
``testing``: unit testing in ExtendScript
=========================================

Extendables comes with `Pivotal Labs <http://pivotallabs.com/>`_' excellent Jasmine unit-testing framework, ever-so-slightly modified to make it work with ExtendScript. Jasmine defines a very intuitive domain-specific language on top of Javascript:

.. code-block:: javascript

    describe('Calculator', function () {
      var counter = 0
    
      it('can add a number', function () {
        counter = counter + 2;   // counter was 0 before
        expect(bar).toEqual(2);
      });
    
      it('can multiply a number', function () {
        counter = counter * 5;   // counter was 2 before
        expect(bar).toEqual(10);
      });
    });

You can `read the documentation to Jasmine <http://pivotal.github.com/jasmine/>`_ at GitHub.